import axios from 'axios'
import { CardType, SentenceListType } from './models'


function getAxios(token?: string | null) {
    const baseURL = 'http://127.0.0.1:8000/api/v1/'
    const headers = (token !== undefined && token !== null) ? 
        { 'Authorization': `Token ${token}` } : undefined

    return axios.create({
        baseURL: baseURL,
        headers: headers
    })
}


async function processAPIResult(result: Promise<any>) {
    return result.then(resp => resp.data)
}


export async function getTokenFromCredentials(
    username: string, password: string
): Promise<string> {
    const loginURL = '/api-token-auth/'

    return processAPIResult(
        getAxios().post(loginURL, {
            username: username,
            password: password
        })
    )
        .then(resp => resp.token)
}


export async function getPlaylist(
    token: string, sentenceListID: number
): Promise<CardType[]> {
    const getPlaylistURL = `/cards/playlist/${sentenceListID}/`

    return processAPIResult(getAxios(token).get(getPlaylistURL))
}


export async function getBookmarksForList(
    token: string, sentenceListID: number
): Promise<CardType[]> {
    const getBookmarksForListURL = `/bookmarks/forList/${sentenceListID}/`

    return processAPIResult(getAxios(token).get(getBookmarksForListURL))
}


export async function updateProficiency(token: string, cardID: number, score: 0|1|2|3|4|5) {
    const updateProficiencyURL = `/cards/${cardID}/updateUsingSM2/`

    return processAPIResult(getAxios(token).post(updateProficiencyURL, {
        score: score
    }))
}


export async function isBookmarked(
    token: string, sentenceListID: number, cardID: number
): Promise<{ result: boolean }> {
    const isBookmarkedURL = `/bookmarks/isBookmarked/${sentenceListID}/${cardID}/`

    return processAPIResult(getAxios(token).get(isBookmarkedURL))
}


export async function getSentenceLists(
    token?: string | null
): Promise<SentenceListType[]> {
    const sentenceListURL = '/lists/'

    return processAPIResult(getAxios(token).get(sentenceListURL)).then(data => data["results"])
}


export async function addBookmark(token: string, sentenceListID: number, cardID: number) {
    const addBookmarkURL = `/bookmarks/add/${sentenceListID}/${cardID}/`

    return processAPIResult(getAxios(token).post(addBookmarkURL))
}


export async function removeBookmark(token: string, sentenceListID: number, cardID: number) {
    const removeBookmarkURL = `/bookmarks/remove/${sentenceListID}/${cardID}/`

    return processAPIResult(getAxios(token).delete(removeBookmarkURL))
}
