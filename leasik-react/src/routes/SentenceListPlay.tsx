import { Component, ReactElement, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

import { getToken } from '../authentication/utils'
import axios from 'axios'


export type SentenceListPlayProps = {
    sentenceListId: number
}

export type SentenceListPlayState = {
    cards: Array<{
        id: number
    }>
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
        return <div>Rendering { cardIndex }...</div>
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
