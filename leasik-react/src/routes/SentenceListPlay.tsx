import { useParams } from 'react-router-dom'

import GeneralListPlay, { AugmentedCardType } from './common/PlayCommon'
import { getToken } from '../utilities/authentication'
import { useEffect, useState } from 'react'
import { CardType } from '../utilities/models'
import { getPlaylist, isBookmarked } from '../utilities/apiCalls'
import { convertToConcreteCard } from '../utilities/utilFunctions'


export default function SentenceListPlay() {
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
            getPlaylist(token, sentenceListID)
                .then(normalCards => normalCards.map(convertToConcreteCard))
                .then(concreteCards => Promise.all(concreteCards.map(toAugmentedCard)))
                .then(setCards)
                .catch(err => alert(`Couldn't load cards. ${err}`))
                .finally(() => setIsLoading(false))

            async function toAugmentedCard(normalCard: CardType): Promise<AugmentedCardType> {
                if (token === null) {
                    return Promise.reject("Token is null.")
                }

                return (
                    isBookmarked(token, sentenceListID, normalCard.id)
                        .then(result => result.result)
                        .then(bookmarkStatus => ({ ...normalCard, isBookmarked: bookmarkStatus }))
                )
            }
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
