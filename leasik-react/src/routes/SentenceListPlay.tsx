import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getToken } from '../utilities/authentication'
import { CardType } from '../utilities/models'
import {
    getWords,
    convertToConcreteCard,
    semanticallyEqual
} from '../utilities/utilFunctions'
import {
    getPlaylist,
    isBookmarked,
    addBookmark,
    removeBookmark,
    updateProficiency
} from '../utilities/apiCalls'


type AugmentedCardType = CardType & { isBookmarked: boolean }
type answerStatusType = "unchecked" | "correct" | "incorrect"


type BookmarkButtonPropsType = { card: AugmentedCardType, onBookmark: () => any }
function BookmarkButton({ card, onBookmark }: BookmarkButtonPropsType) {
    return (
        <div className='block'>
            <button
                onClick={ onBookmark }
                className={ `button is-${card.isBookmarked ? 'danger' : 'info'}` }
            >
                { card.isBookmarked ? 'Remove ' : '' } Bookmark
            </button>
        </div>
    )
}


type UtilityButtonsPropsType = { card: AugmentedCardType, onBookmark: () => any }
function UtilityButtons({ card, onBookmark }: UtilityButtonsPropsType) {
    return (
        <div className='container has-text-centered'>
            <BookmarkButton
                card={ card }
                onBookmark={ onBookmark }
            />
        </div>
    )
}


type AnswerButtonsPropsType = {
    answerStatus: answerStatusType
    onAnswerCheck: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
}
function AnswerButtons({ answerStatus, onAnswerCheck, onNext }: AnswerButtonsPropsType) {
    const submitFunction = (answerStatus === 'unchecked') ? onAnswerCheck : onNext
    const buttonText = (answerStatus === 'unchecked') ? 'Check' : 'Next'

    return (
        <div className='container has-text-centered block'>
            <button className='button is-primary' onClick={ submitFunction }>
                { buttonText }
            </button>
        </div>
    )
}


type QuestionPropsType = {
    card: AugmentedCardType
    answerStatus: answerStatusType
    currentInput: string
    onInputChange: (arg0: string) => any
    onEnterKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => any
}
function Question(
    { card, answerStatus, currentInput, onInputChange, onEnterKeyPress }: QuestionPropsType
) {
    const words = getWords(card.sentence.text)

    // `Question`s are fill-in-the-blanks type questions.
    // `card.hidden_word_position` determines the blank, and `preBlank` and
    // `postBlank` are parts of the sentence that occur before and after the
    // blank
    const preBlank = words.slice(0, card.hidden_word_position).join(' ')
    const postBlank = words.slice(card.hidden_word_position + 1).join(' ')

    const statusToClassName = {
        'correct': 'has-text-success',
        'incorrect': 'has-text-danger',
        'unchecked': ''
    }

    const baseClasses = 'title has-text-centered input is-static'
    const additionalClasses = statusToClassName[answerStatus]
    const allClasses = `${baseClasses} ${additionalClasses}`

    function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            return onEnterKeyPress(e)
        }
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        return onInputChange(e.target.value)
    }

    return (
        <div className='block'>
            <p className='title is-3'>{ preBlank }</p>
            <input
                value={ currentInput }
                onChange={ onChange }
                onKeyPress={ onKeyPress }
                className={ allClasses }

                readOnly={ answerStatus !== 'unchecked' }
                autoFocus
            />
            <p className='title is-3'>{ postBlank }</p>
        </div>
    )
}


type QuestionHintPropsType = { card: CardType }
function QuestionHint({ card }: QuestionHintPropsType) {
    return (
        <div className='block'>
            <p className='title is-6'>{ card.sentence.translation }</p>
            <div className='block'>
                <textarea className='p-2' defaultValue={ card.note } />
            </div>
        </div>
    )
}


type QuestionAreaPropsType = {
    card: AugmentedCardType
    answerStatus: answerStatusType
    currentInput: string
    onEnterKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => any
    onInputChange: (arg0: string) => any
}
function QuestionArea(
    { card, answerStatus, currentInput, onEnterKeyPress, onInputChange }: QuestionAreaPropsType
) {
    return (
        <div className='container has-text-centered'>
            <Question
                card={ card }
                answerStatus={ answerStatus }
                currentInput={ currentInput }
                onEnterKeyPress={ onEnterKeyPress }
                onInputChange={ onInputChange }
            />

            <QuestionHint card={ card } />
        </div>
    )
}


type QuizDisplayPropsType = {
    card: AugmentedCardType
    onBookmark: () => any
    answerStatus: answerStatusType
    currentInput: string
    onEnterKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => any
    onInputChange: (arg0: string) => any
    onAnswerCheck: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
}
function QuizDisplay(props: QuizDisplayPropsType) {
    const { 
        card,
        onBookmark,
        answerStatus,
        currentInput,
        onEnterKeyPress,
        onInputChange,
        onAnswerCheck,
        onNext 
    } = props

    return (
        <div className='pt-5'>
            <div className='hero-head'>
                <UtilityButtons
                    card={ card }
                    onBookmark={ onBookmark }
                />
            </div>
            
            <div className='hero-body'>
                <QuestionArea
                    card={ card }
                    currentInput={ currentInput }
                    answerStatus={ answerStatus }
                    onEnterKeyPress={ onEnterKeyPress }
                    onInputChange={ onInputChange }
                />
            </div>

            <div className='hero-footer'>
                <AnswerButtons
                    answerStatus={ answerStatus }
                    onAnswerCheck={ onAnswerCheck }
                    onNext={ onNext }
                />
            </div>
        </div>
    )
}


export default function SentenceListPlay() {
    const params = useParams()
    const sentenceListID = parseInt((params.listId !== undefined) ? params.listId : '')
    const token = getToken()

    const [cards, setCards] = useState<AugmentedCardType[]>([])
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [areCardsLoading, setAreCardsLoading] = useState(false)
    const [errorLoadingCards, setErrorLoadingCards] = useState(false)
    const [userInput, setUserInput] = useState('')
    const [currentCardAnswerStatus, setCurrentCardAnswerStatus] = (
        useState<answerStatusType>("unchecked")
    )

    useEffect(
        () => {
            if (!token) {
                return
            }

            setAreCardsLoading(true)
            fetchCards()
                .then(setCards)
                .catch(() => setErrorLoadingCards(true))
                .finally(() => setAreCardsLoading(false))
                
            
            async function fetchCards() {
                if (token === null) {
                    // this should never happen because fetchCards should only
                    // be called by code that has verified that token is valid
                    return Promise.reject("Token is null.")
                }

                return getPlaylist(token, sentenceListID)
                    .then(loadedCards => loadedCards.map(convertToConcreteCard))
                    .then(normalCards => Promise.all(normalCards.map(toAugmentedCard)))
            }

            async function toAugmentedCard(card: CardType): Promise<AugmentedCardType> {
                if (token === null) {
                    // this should never happen because fetchCards should only
                    // be called by code that has verified that token is valid
                    return Promise.reject("Token is null.")
                }

                return isBookmarked(token, sentenceListID, card.id)
                    .then(data => data["result"])
                    .then(bookmarkStatus => {
                        return { ...card, isBookmarked: bookmarkStatus }
                    })
            }
        },
        [sentenceListID, token]
    )

    
    if (token === null) {
        return <p>Pleae login first.</p>
    }

    if (errorLoadingCards) {
        return <p>Couldn't load cards. :(</p>
    }

    if (areCardsLoading) {
        return <p>Loading...</p>
    }

    if (cards.length === 0) {
        return <p>List is empty!</p>
    }

    if (currentCardIndex === cards.length) {
        return <div>Quiz finished!</div>
    }

    return (
        <QuizDisplay
            answerStatus={ currentCardAnswerStatus }
            card={ cards[currentCardIndex] }
            currentInput={ userInput }
            onAnswerCheck={ checkAnswer }
            onBookmark={ toggleBookmarkStatusOfCurrentCard }
            onEnterKeyPress={ enterCheckAndNext }
            onInputChange={ setUserInput }
            onNext={ nextCard }
        />
    )

    async  function toggleBookmarkStatusOfCurrentCard() {
        if (token === null) {
            // this should never happen as this function should only be called
            // from a part of the code where token is available
            return Promise.reject("Token is null.")
        }

        const cardsCopy = cards.slice()
        const currentCard = cardsCopy[currentCardIndex]
        const apiFunction = currentCard.isBookmarked ? removeBookmark : addBookmark

        return  apiFunction(token, sentenceListID, currentCard.id)
            .then(_ => currentCard.isBookmarked = !currentCard.isBookmarked)
            .then(_ => setCards(cardsCopy))
            .catch(err => alert(`Couldn't toggle bookmark. ${err}`))
    }

    function checkAnswerCore() {
        const currentCard = cards[currentCardIndex]
        const correctAnswer = getWords(currentCard.sentence.text)[currentCard.hidden_word_position]

        const score = semanticallyEqual(userInput, correctAnswer) ? 5 : 0
        
        if (score === 0) {
            setCurrentCardAnswerStatus('incorrect')
        } else {
            setCurrentCardAnswerStatus('correct')
        }

        setUserInput(correctAnswer)
        
        if (token !== null) {
            updateProficiency(token, currentCard.id, score)
                .catch(err => alert(`Couldn't update card proficiency. ${err}`))
        }
    }

    function checkAnswer(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        checkAnswerCore()
    }

    function nextCardCore() {
        setCurrentCardIndex(currentCardIndex + 1)
        setUserInput('')
        setCurrentCardAnswerStatus('unchecked')
    }

    function nextCard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        nextCardCore()
    }

    function enterCheckAndNext(e: React.KeyboardEvent<HTMLInputElement>) {
        e.preventDefault()

        if (currentCardAnswerStatus === 'unchecked') {
            checkAnswerCore()
        } else {
            nextCardCore()
        }
    }
}
