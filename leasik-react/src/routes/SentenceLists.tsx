import { Component, ReactNode } from 'react'
import { Link } from 'react-router-dom'


export type SentenceListType = {
    id: number,
    name: string,
    slug: string,
    description: string,
    owner: {
        id: number
    },
    is_public: boolean,
    sentences: Array<{ id: number }>
}

export type SentenceListPropsType = {
    sentenceListId: number,
    name: string,
    description: string
}

export type SentenceListsStateType = {
    sentenceLists: Array<SentenceListType>
}


export class SentenceList extends Component<SentenceListPropsType, {}> {
    render(): ReactNode {
        return (
            <div>
                <h2>{ this.props.name }</h2>
                <p>{ this.props.description }</p>
                <div>
                    <Link to={`/lists/${ this.props.sentenceListId }`}>Play</Link>
                    <Link to={`/lists/${ this.props.sentenceListId }/bookmarks`}>Bookmarks</Link>
                </div>
            </div>
        )
    }
}


export default class SentenceLists extends Component {
    state: SentenceListsStateType = { sentenceLists: [] }

    componentDidMount() {
        const getSentenceListsURL = 'http://127.0.0.1:8000/api/v1/lists/'
        fetch(getSentenceListsURL)
            .then(resp => resp.json())
            .then(data => data['results'])
            .then(sentenceLists => this.setState({ sentenceLists }))
    }

    render(): ReactNode {
        return (
            <div>
                { this.state.sentenceLists.map(sl => (
                    <SentenceList
                        key={ sl.id }
                        sentenceListId={ sl.id }
                        name={ sl.name }
                        description={ sl.description }
                    />
                )) }
            </div>
        )
    }
}
