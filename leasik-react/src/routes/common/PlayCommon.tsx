import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { CardType } from '../../utilities/models'
import { getToken } from '../../utilities/authentication'
import {
    getWords,
    semanticallyEqual,
    convertToConcreteCard
} from '../../utilities/utilFunctions'
import {
    removeBookmark,
    addBookmark,
    updateProficiency,
    isBookmarked
} from '../../utilities/apiCalls'


export type AugmentedCardType = CardType & { isBookmarked: boolean }
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
                <textarea className='textarea is-info' defaultValue={ card.note } />
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
function QuizDisplay({
    card,
    onBookmark,
    answerStatus,
    currentInput,
    onEnterKeyPress,
    onInputChange,
    onAnswerCheck,
    onNext
}: QuizDisplayPropsType) {
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


type GeneralListPlayCorePropsType = {
    initialCards: Promise<CardType[]>
    assumeDefaultBookmarkValue?: boolean
}
function GeneralListPlayCore(
    {initialCards, assumeDefaultBookmarkValue }: GeneralListPlayCorePropsType
) {
    const params = useParams()
    const sentenceListID = parseInt((params.listId !== undefined) ? params.listId : '')
    const token = getToken()

    const [isLoading, setIsLoading] = useState(false)
    const [cards, setCards] = useState<AugmentedCardType[]>([])
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [userInput, setUserInput] = useState('')
    const [currentCardAnswerStatus, setCurrentCardAnswerStatus] = (
        useState<answerStatusType>("unchecked")
    )

    useEffect(
        () => {
            if (token === null) {
                return
            }

            setIsLoading(true)
            initialCards
                .then(normalCards => normalCards.map(convertToConcreteCard))
                .then(concreteCards => Promise.all(concreteCards.map(toAugmentedCard)))
                .then(setCards)
                .catch(err => alert(`Couldn't load cards. ${err}`))
                .finally(() => setIsLoading(false))

            function toAugmentedCard(normalCard: CardType): Promise<AugmentedCardType> {
                if (token === null) {
                    return Promise.reject("Token is null.")
                }

                if (assumeDefaultBookmarkValue) {
                    return new Promise(
                        resolve => resolve({
                            ...normalCard,
                            isBookmarked: assumeDefaultBookmarkValue
                        })
                    )
                }

                return (
                    isBookmarked(token, sentenceListID, normalCard.id)
                        .then(bookmarkStatus => ({ ...normalCard, isBookmarked: bookmarkStatus }))
                )
            }
        },
        [token, initialCards, sentenceListID, assumeDefaultBookmarkValue]
    )

    if (token === null) {
        return <div>Please log in first.</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
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
            return Promise.reject("Token is null")
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
        if (token === null) {
            return Promise.reject("Token is null.")
        }

        const currentCard = cards[currentCardIndex]
        const correctAnswer = getWords(currentCard.sentence.text)[currentCard.hidden_word_position]

        const score = semanticallyEqual(userInput, correctAnswer) ? 5 : 0
        
        if (score === 0) {
            setCurrentCardAnswerStatus('incorrect')
        } else {
            setCurrentCardAnswerStatus('correct')
        }

        setUserInput(correctAnswer)
        
        updateProficiency(token, currentCard.id, score)
            .catch(err => alert(`Couldn't update card proficiency. ${err}`))
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


type GeneralListPlayPropsType = {
    getInitialCards: (token: string, sentenceListID: number) => Promise<CardType[]>
    assumeDefaultBookmarkValue?: boolean
}
export default function GeneralListPlay(
    { getInitialCards, assumeDefaultBookmarkValue }: GeneralListPlayPropsType
) {
    const params = useParams()
    const sentenceListID = parseInt((params.listId !== undefined) ? params.listId : '')
    const token = getToken()

    if (token === null) {
        return <div>Please log in first.</div>
    }

    const initialCards = getInitialCards(token, sentenceListID)
    return (
        <GeneralListPlayCore
            initialCards={ initialCards }
            assumeDefaultBookmarkValue={ assumeDefaultBookmarkValue }
        />
    )
}
