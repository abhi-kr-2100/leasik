import axios from 'axios'


function getAxios(token?: string | null) {
    const baseURL = 'http://127.0.0.1:8000/api/v1/'
    const headers = token ? { 'Authorization': `Token ${token}` } : undefined

    return axios.create({
        baseURL: baseURL,
        headers: headers
    })
}


async function processAPIResult(result: Promise<any>) {
    return result.then(resp => resp.data).catch(reason => { return { error: reason } })
}


export async function getTokenFromCredentials(username: string, password: string) {
    const loginURL = '/api-token-auth/'

    return processAPIResult(
        getAxios().post(loginURL, {
            username: username,
            password: password
        })
    )
}


export async function getPlaylist(token: string, sentenceListID: number) {
    const getPlaylistURL = `/cards/playlist/${sentenceListID}/`

    return processAPIResult(getAxios(token).get(getPlaylistURL))
}


export async function isBookmarked(token: string, sentenceListID: number, cardID: number) {
    const isBookmarkedURL = `/bookmarks/isBookmarked/${sentenceListID}/${cardID}/`

    return processAPIResult(getAxios(token).get(isBookmarkedURL))
}


export async function getSentenceLists(token?: string | null) {
    const sentenceListURL = '/lists/'

    return processAPIResult(getAxios(token).get(sentenceListURL))
}


export async function addBookmark(token: string, sentenceListID: number, cardID: number) {
    const addBookmarkURL = `/bookmarks/add/${sentenceListID}/${cardID}/`

    return processAPIResult(getAxios(token).post(addBookmarkURL))
}


export async function removeBookmark(token: string, sentenceListID: number, cardID: number) {
    const removeBookmarkURL = `/bookmarks/remove/${sentenceListID}/${cardID}/`

    return processAPIResult(getAxios(token).delete(removeBookmarkURL))
}
