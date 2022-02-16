import { Component, ReactElement, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

import { getToken } from '../authentication/utils'
import axios from 'axios'
import { Card } from '../models/core'
import { RawCard, Sentence } from '../models/aux'


export type SentenceListPlayProps = {
    sentenceListId: number
}

export type SentenceListPlayState = {
    cards: Array<Card>
    currentCardIndex: number

    token: string | null

    loading: boolean
    checked: boolean
    answerStatus: "unchecked" | "correct" | "incorrect"

    userInput: string
}


export class SentenceListPlay extends Component<SentenceListPlayProps, SentenceListPlayState> {
    state = {
        cards: [],
        currentCardIndex: 0,

        token: getToken(),
        
        loading: false,
        checked: false,
        answerStatus: "unchecked" as "unchecked" | "correct" | "incorrect",

        userInput: ''
    }

    constructor(props: SentenceListPlayProps) {
        super(props)

        axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/'
        axios.defaults.headers.common['Authorization'] = `Token ${this.state.token}`
    }

    componentDidMount() {
        if (!this.state.token) {
            return;
        }

        const getCardsURL = `/cards/playlist/${this.props.sentenceListId}/`
        const cards: Array<Card> = []

        this.setState({ loading: true })
        axios.get(getCardsURL)
            .then(resp => resp.data)
            .then(data => getRawCardData(data))
            .then(
                // convert RawCards to Cards one-by-one using getCardData, and
                // add it to the cards array
                rawCards => Promise.all(
                    rawCards.map(
                        c => getCardData(
                            c,
                            this.props.sentenceListId,
                            this.state.token
                        ).then(card => cards.push(card))
                    )
                )
            )
            .then(_ => this.setState({ cards: cards, currentCardIndex: 0, loading: false }))

        function getCardData(
                card: RawCard,
                sentenceListId: number,
                token: string | null
        ): Promise<Card> {
            const isBookmarkedURL = `/bookmarks/isBookmarked/${sentenceListId}/${card.id}/`
            return axios.get(isBookmarkedURL)
                .then(resp => resp.data)
                .then(data => data["result"])
                .then(isBookmarked => {
                    // convert RawCard to Card by adding bookmarked to sentence property
                    return { ...card, isBookmarked: isBookmarked }
                })
        }

        function getRawCardData(cards: Array<RawCard>): Array<RawCard> {
            return cards.map(c => {
                if (c.hidden_word_position !== -1) {
                    return c
                }
    
                const words = c.sentence.text.split(" ").filter(w => w !== '')
                const hiddenWordPosition = Math.floor(Math.random() * words.length)
                c.hidden_word_position = hiddenWordPosition
    
                return c
            })
        }
    }

    render(): ReactNode {
        if (!this.state.token) {
            return <p>Pleae login first.</p>
        }

        if (this.state.loading) {
            return <p>Loading...</p>
        }

        if (this.state.cards.length === 0) {
            return <p>List is empty!</p>
        }

        if (this.state.currentCardIndex === this.state.cards.length) {
            return this.renderFinishScreen()
        }

        return this.renderCardScreen(this.state.currentCardIndex)
    }

    renderFinishScreen(): ReactNode {
        return <div>Quiz finished!</div>
    }

    renderCardScreen(cardIndex: number): ReactNode {
        const cardToRender: Card = this.state.cards[cardIndex]
        const sentenceText = cardToRender.sentence.text
        const words = sentenceText.split(" ").filter(i => i !== '')
        const hiddenWordPosition = cardToRender.hidden_word_position
        const correctAnswer = words[hiddenWordPosition]

        return (
            <div onKeyPress={ e => {
                    e.key === 'Enter' ? this.handleSumbit(correctAnswer) : noop()
                    function noop() {}
                } }
            >
                <div className='hero-head'>
                    <div className='block'></div>

                    <div className='container has-text-centered'>
                        <div className='block'>
                            {
                                !cardToRender.isBookmarked ? 
                                    <button
                                        onClick={_ => this.addBookmark()}
                                        className='button is-info'
                                    >
                                        Bookmark
                                    </button> :
                                    <button
                                        onClick={_ => this.removeBookmark()}
                                        className='button is-danger'
                                    >
                                        Remove Bookmark
                                    </button>
                            }
                        </div>
                    </div>
                </div>

                <div className='hero-body'>
                    <div className='container has-text-centered'>
                        <div className='block'>
                            <p className='title is-3'>
                                { words.slice(0, hiddenWordPosition).join(' ') }
                            </p>
                            <input
                                onChange={ e => this.setState({ userInput: e.target.value }) }
                                value={ this.state.userInput }
                                className={
                                    'title has-text-centered input is-static ' +
                                    (() => {
                                        switch (this.state.answerStatus) {
                                        case 'correct':
                                            return 'has-text-success'
                                        case 'incorrect':
                                            return 'has-text-danger'
                                        default:
                                            return ''
                                        } 
                                    })()
                                }

                                readOnly={ this.state.answerStatus !== 'unchecked' }
                                autoFocus
                            />
                            <p className='title is-3'>
                                { words.slice(hiddenWordPosition + 1).join(' ') }
                            </p>
                        </div>

                        <div className='block'>
                            <p className='title is-6'>{ cardToRender.sentence.translation }</p>
                            <div className='block'>
                                <textarea className='p-2'>
                                    { cardToRender.note }
                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='hero-footer'>
                    <div className='container has-text-centered block'>
                        <button className='button is-primary' onClick={ _ => this.handleSumbit(correctAnswer) }>
                            { this.state.checked ? 'Next' : 'Check' }
                        </button>
                    </div>

                    <div className='block'></div>
                </div>
            </div>
        )
    }

    handleSumbit(correctAnswer: string) {
        if (this.state.checked) {
            const nextCardIndex = this.state.currentCardIndex + 1
            this.setState({
                currentCardIndex: nextCardIndex,
                checked: false,
                answerStatus: "unchecked",
                userInput: ''
            })

            return
        }

        const currentCard: Card = this.state.cards[this.state.currentCardIndex]
        const proficiencyUpdateURL = `http://127.0.0.1:8000/api/v1/cards/${currentCard.id}/updateUsingSM2/`

        const score = closeEnough(this.state.userInput, correctAnswer) ? 5 : 0
        if (score !== 0) {
            this.setState({ answerStatus: "correct", checked: true, userInput: correctAnswer })
        } else {
            this.setState({ answerStatus: "incorrect", checked: true, userInput: correctAnswer })
        }

        axios.post(proficiencyUpdateURL, { 'score': score }, {
            headers: {
                'Authorization': `Token ${this.state.token}`
            }
        }).catch(err => alert(`Couldn't update proficiency: ${err}`))

        function closeEnough(s1: string, s2: string): boolean {
            return normalizeSentence(s1) === normalizeSentence(s2)

            function normalizeSentence(s: string): string {
                return (
                    s
                        .replace(/[^\p{L}\s]/gu, '')
                        .replace(/\s{2,}/g, ' ')
                        .toLowerCase()
                )
            }
        }
    }

    addBookmark() {
        const sentenceListId = this.props.sentenceListId
        const cardId = (this.state.cards[this.state.currentCardIndex] as Card).id
        const addBookmarkURL = `/bookmarks/add/${sentenceListId}/${cardId}/`
        
        const cards: Array<Card> = this.state.cards.slice()
        cards[this.state.currentCardIndex].isBookmarked = true

        axios.post(addBookmarkURL)
            .then(_ => this.setState({ cards: cards }))
            .catch(err => alert(`Couldn't create bookmark: ${err}`))
    }

    removeBookmark() {
        const sentenceListId = this.props.sentenceListId
        const cardId = (this.state.cards[this.state.currentCardIndex] as Card).id
        const removeBookmarkURL = `/bookmarks/remove/${sentenceListId}/${cardId}/`
        
        const cards: Array<Card> = this.state.cards.slice()
        cards[this.state.currentCardIndex].isBookmarked = false

        axios.delete(removeBookmarkURL)
            .then(_ => this.setState({ cards: cards }))
            .catch(err => alert(`Couldn't remove bookmark: ${err}`))
    }
}


// this is required because we need to use hooks to obtain props for SentenceListPlay
export default function SentenceListPlayRouterComponent(): ReactElement {
    const { listId } = useParams()

    if (listId !== undefined)
        return (
            <SentenceListPlay sentenceListId={ parseInt(listId) } />
        )
    return (
        <div>Error: listId was undefined.</div>
    )
}
