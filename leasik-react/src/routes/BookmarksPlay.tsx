import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import GeneralListPlay, { AugmentedCardType } from './common/PlayCommon'
import { getToken } from '../utilities/authentication'
import { getBookmarksForList } from '../utilities/apiCalls'
import { convertToConcreteCard } from '../utilities/utilFunctions'


export default function BookmarksPlay() {
    const params = useParams()
    const sentenceListID = parseInt((params.listId !== undefined) ? params.listId : '')
    const token = getToken()

    const [cards, setCards] = useState<AugmentedCardType[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(
        () => {
            if (token === null) {
                return
            }

            setIsLoading(true)
            getBookmarksForList(token, sentenceListID)
                .then(normalCards => normalCards.map(convertToConcreteCard))
                .then(concreteCards => concreteCards.map(c => ({ ...c, isBookmarked: true })))
                .then(setCards)
                .catch(err => alert(`Couldn't load cards. ${err}`))
                .finally(() => setIsLoading(false))
        },
        [token, sentenceListID]
    )

    if (token === null) {
        return <p>Please log in first.</p>
    }
    
    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <GeneralListPlay
            initialCards={ cards }
            sentenceListID={ sentenceListID }
            token={ token }
        />
    )
}
