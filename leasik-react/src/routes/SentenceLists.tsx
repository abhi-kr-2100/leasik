import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getSentenceLists } from '../utilities/apiCalls'
import { getToken } from '../utilities/authentication'
import { SentenceListType } from '../utilities/models'


function SentenceList({ id, name, description }: SentenceListType) {
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
                <Link to={ `/lists/${ id }` }
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
            const token = getToken()

            getSentenceLists(token)
                .then(data => data['results'])
                .then(sentenceLists => setSentences(sentenceLists))
                .catch(error => alert(`Unexpected error: ${error.reason}`))
        },
        []
    )

    return (
        <div>
            <div className='container is-fluid pt-5'>
                { sentences.map(sl => (
                    <SentenceList
                        key={ sl.id }
                        id={ sl.id }
                        name={ sl.name }
                        description={ sl.description }
                    />
                )) }
            </div>
        </div>
    )
}
