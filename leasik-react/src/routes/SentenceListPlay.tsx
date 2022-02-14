import { Component, ReactElement, ReactNode } from 'react'
import { useParams } from 'react-router-dom'


export type SentenceListPlayProps = {
    sentenceListId: number
}

export type SentenceListPlayState = {
    cards: Array<{
        id: number
    }>

    currentCardIndex: number
}


export class SentenceListPlay extends Component<SentenceListPlayProps, SentenceListPlayState> {
    state = {
        cards: [],
        currentCardIndex: 0
    }

    componentDidMount() {
        const getCardsURL = `http://127.0.0.1:8000/api/v1/cards/playlist/${this.props.sentenceListId}/`
        fetch(getCardsURL)
            .then(resp => resp.json())
            .then(data => this.setState({ cards: data, currentCardIndex: 0 }))
    }

    render(): ReactNode {
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
