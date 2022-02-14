import axios from 'axios'
import { Component, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../authentication/utils'


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
            <div className='card block'>
                <header className="card-header">
                    <h2 className="card-header-title notification is-primary">
                        { this.props.name }
                    </h2>
                </header>

                <div className="card-content">
                    <div className="content">
                        <p>{ this.props.description }</p>
                    </div>
                </div>

                <footer className="card-footer">
                    <Link to={ `/lists/${ this.props.sentenceListId }` }
                        className="card-footer-item button is-primary is-outlined"
                    >
                        Play
                    </Link>
                </footer>
            </div>
        )
    }
}


export default class SentenceLists extends Component {
    state: SentenceListsStateType = { sentenceLists: [] }

    componentDidMount() {
        const getSentenceListsURL = 'http://127.0.0.1:8000/api/v1/lists/'
        const token = getToken()
        const headers = token !== null ? { "Authorization": `Token ${token}` } : undefined

        axios.get(getSentenceListsURL, {
            headers: headers
        })
            .then(resp => resp.data)
            .then(data => data['results'])
            .then(sentenceLists => this.setState({ sentenceLists }))
            .catch(reason => alert("Please login again or try again later."))
    }

    render(): ReactNode {
        return (
            <div>
                <div className='block'></div>
                <div className='container is-fluid'>
                    { this.state.sentenceLists.map(sl => (
                        <SentenceList
                            key={ sl.id }
                            sentenceListId={ sl.id }
                            name={ sl.name }
                            description={ sl.description }
                        />
                    )) }
                </div>
            </div>
        )
    }
}
