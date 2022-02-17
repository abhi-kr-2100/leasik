import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getSentenceLists } from '../apiCalls'
import { getToken } from '../utilities/authentication'
import { SentenceListType } from '../models'


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
                        id={ sl.id }
                        name={ sl.name }
                        description={ sl.description }
                    />
                )) }
            </div>
        </div>
    )
}
