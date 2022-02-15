import { Component, ReactElement, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

import { getToken } from '../authentication/utils'
import axios from 'axios'


export type Card = {
    id: number
    repetition_number: number
    easiness_facotr: number
    inter_repetition_interval: string
    last_review_date: string
    note: string
    owner: {
        id: number
    }
    sentence: {
        id: number
        text: string
        translation: string
        text_language: string
        translation_language: string
    }
    hidden_word_position: number
}

export type SentenceListPlayProps = {
    sentenceListId: number
}

export type SentenceListPlayState = {
    cards: Array<Card>
    currentCardIndex: number

    token: string | null
    loading: boolean
}


export class SentenceListPlay extends Component<SentenceListPlayProps, SentenceListPlayState> {
    state = {
        cards: [],
        currentCardIndex: 0,
        token: getToken(),
        loading: false
    }

    componentDidMount() {
        if (!this.state.token) {
            return;
        }

        const getCardsURL = `http://127.0.0.1:8000/api/v1/cards/playlist/${this.props.sentenceListId}/`
        this.setState({ loading: true })
        axios.get(getCardsURL, {
            headers: {
                "Authorization": `Token ${this.state.token}`
            }
        }).then(resp => this.setState({ cards: resp.data, currentCardIndex: 0 }))
            .then(_ => this.setState({ loading: false }))
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
        return (
            <div>
                <div className='hero-head'>
                    <div className='block'></div>
                </div>

                <div className='hero-body'>
                    <div className='container has-text-centered'>
                        <div className='block'>
                            <p className='title is-3'>{ cardToRender.sentence.text }</p>
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
                        <button className='button is-primary'>Check</button>
                    </div>

                    <div className='block'></div>
                </div>
            </div>
        )
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
