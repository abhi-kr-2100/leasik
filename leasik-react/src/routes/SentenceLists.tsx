import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getToken } from '../authentication/utils'
import { SentenceListType } from '../models/core'


function SentenceList(props: {
    sentenceListID: number
    name: string
    description: string
}) {
    const { sentenceListID, name, description } = props

    return (
        <div className='card block'>
            <header className="card-header">
                <h2 className="card-header-title notification is-primary">{ name }</h2>
            </header>

            <div className="card-content">
                <div className="content">
                    <p>{ description }</p>
                </div>
            </div>

            <footer className="card-footer">
                <Link to={ `/lists/${ sentenceListID }` }
                    className="card-footer-item button is-primary is-outlined"
                >
                    Play
                </Link>
            </footer>
        </div>
    )
}


export default function SentenceLists() {
    const [sentences, setSentences] = useState<Array<SentenceListType>>([])

    useEffect(
        () => {
            const getSentenceListsURL = 'http://127.0.0.1:8000/api/v1/lists/'
            const token = getToken()
            const headers = token !== null ? { "Authorization": `Token ${token}` } : undefined

            axios.get(getSentenceListsURL, {
                headers: headers
            })
                .then(resp => resp.data)
                .then(data => data['results'])
                .then(sentenceLists => setSentences(sentenceLists))
                .catch(reason => alert("Please login again or try again later."))
        },
        []
    )

    return (
        <div>
            <div className='block'></div>
            <div className='container is-fluid'>
                { sentences.map(sl => (
                    <SentenceList
                        key={ sl.id }
                        sentenceListID={ sl.id }
                        name={ sl.name }
                        description={ sl.description }
                    />
                )) }
            </div>
        </div>
    )
}
