import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getSentenceLists } from '../utilities/apiCalls'
import { getToken } from '../utilities/authentication'
import { SentenceListType } from '../utilities/models'


type SentenceListPropsType = { sentenceList: SentenceListType }
function SentenceList({ sentenceList }: SentenceListPropsType) {
    const { id, name, description } = sentenceList

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
                <Link
                    to={ `/lists/${ id }` }
                    className="card-footer-item button is-primary is-outlined"
                >
                    Play
                </Link>
                <Link
                    to={ `/lists/${ id }/bookmarks` }
                    className="card-footer-item button is-success is-outlined"
                >
                    Bookmarks
                </Link>
            </footer>
        </div>
    )
}


export default function SentenceLists() {
    const [sentenceLists, setSentenceLists] = useState<SentenceListType[]>([])

    useEffect(
        () => {
            const token = getToken()

            getSentenceLists(token)
                .then(setSentenceLists)
                .catch(error => alert(`Couldn't load sentence lists! ${error}`))
        },
        []
    )

    return (
        <div>
            <div className='container is-fluid pt-5'>
                { sentenceLists.map(sl => <SentenceList key={ sl.id } sentenceList={ sl } />) }
            </div>
        </div>
    )
}
