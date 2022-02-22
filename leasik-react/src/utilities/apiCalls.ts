import axios from "axios";
import { ICard, ISentenceList, ICardBase, ISentenceListBase } from "./models";
import { convertBaseToExtended } from "./utilFunctions";
import { toString } from "./utilFunctions";

function getAxios(token?: string | null) {
    const baseURL = "http://127.0.0.1:8000/api/v1/";
    const isTokenValid = token !== undefined && token !== null;
    const headers = isTokenValid
        ? { Authorization: `Token ${token}` }
        : undefined;

    return axios.create({
        baseURL: baseURL,
        headers: headers,
    });
}

export async function getTokenFromCredentials(
    username: string,
    password: string
): Promise<string> {
    const loginURL = "/api-token-auth/";

    return getAxios()
        .post(loginURL, { username: username, password: password })
        .then((response) => response.data)
        .then((data) => data.token);
}

export async function getPlaylist(
    token: string,
    sentenceListID: BigInt
): Promise<ICard[]> {
    const getPlaylistURL = `/cards/playlist/${sentenceListID}/`;

    return getAxios(token)
        .get(getPlaylistURL)
        .then((response) => response.data as ICardBase[])
        .then((cards) =>
            cards.map(convertBaseToExtended as (x: ICardBase) => ICard)
        );
}

export async function getBookmarksForList(
    token: string,
    sentenceListID: BigInt
): Promise<ICard[]> {
    const getBookmarksForListURL = `/bookmarks/forList/${sentenceListID}/`;

    return getAxios(token)
        .get(getBookmarksForListURL)
        .then((response) => response.data as ICardBase[])
        .then((cards) =>
            cards.map(convertBaseToExtended as (x: ICardBase) => ICard)
        );
}

type SM2ScoreType = 0 | 1 | 2 | 3 | 4 | 5; // possible scores under the SM-2 algorithm
export async function updateProficiency(
    token: string,
    cardID: BigInt,
    score: SM2ScoreType
) {
    const updateProficiencyURL = `/cards/${cardID}/updateUsingSM2/`;

    return getAxios(token)
        .post(updateProficiencyURL, { score: score })
        .then((response) => response.data);
}

export async function replaceWithNewCards(
    token: string,
    cardID: BigInt,
    newHiddenWordPositions: number[]
): Promise<ICard[]> {
    const replaceWithNewCardsURL = `/cards/replaceWithNewCards/`;

    return getAxios(token)
        .post(replaceWithNewCardsURL, {
            availableCardID: cardID.toString(),
            hiddenWordPositions: newHiddenWordPositions,
        })
        .then((response) => response.data as ICardBase[])
        .then((cards) =>
            cards.map(convertBaseToExtended as (x: ICardBase) => ICard)
        );
}

export async function isBookmarked(
    token: string,
    sentenceListID: BigInt,
    cardID: BigInt
): Promise<boolean> {
    const isBookmarkedURL = `/bookmarks/isBookmarked/${sentenceListID}/${cardID}/`;

    return getAxios(token)
        .get(isBookmarkedURL)
        .then((response) => response.data)
        .then((data) => data.result);
}

export async function isBookmarkedBulk(
    token: string,
    sentenceListID: BigInt,
    cardIDs: BigInt[]
): Promise<boolean[]> {
    const isBookmarkedBulkURL = `/bookmarks/isBookmarkedBulk/${sentenceListID}/`;

    return getAxios(token)
        .post(isBookmarkedBulkURL, {
            cardIDs: cardIDs.map(toString),
        })
        .then((response) => response.data);
}

export async function getSentenceLists(
    token?: string | null
): Promise<ISentenceList[]> {
    const sentenceListURL = "/lists/";

    return getAxios(token)
        .get(sentenceListURL)
        .then((response) => response.data)
        .then((data) => data["results"] as ISentenceListBase[])
        .then((sentenceLists) =>
            sentenceLists.map(
                convertBaseToExtended as (
                    x: ISentenceListBase
                ) => ISentenceList
            )
        );
}

export async function addBookmark(
    token: string,
    sentenceListID: BigInt,
    cardID: BigInt
) {
    const addBookmarkURL = `/bookmarks/add/${sentenceListID}/${cardID}/`;

    return getAxios(token)
        .post(addBookmarkURL)
        .then((response) => response.data);
}

export async function addBookmarkBulk(
    token: string,
    sentenceListID: BigInt,
    cardIDs: BigInt[]
) {
    const addBookmarkBulkURL = `/bookmarks/addBulk/${sentenceListID}/`;

    return getAxios(token)
        .post(addBookmarkBulkURL, {
            cardIDs: cardIDs.map(toString),
        })
        .then((response) => response.data);
}

export async function removeBookmark(
    token: string,
    sentenceListID: BigInt,
    cardID: BigInt
) {
    const removeBookmarkURL = `/bookmarks/remove/${sentenceListID}/${cardID}/`;

    return getAxios(token)
        .delete(removeBookmarkURL)
        .then((response) => response.data);
}

export async function removeBookmarkBulk(
    token: string,
    sentenceListID: BigInt,
    cardIDs: BigInt[]
) {
    const removeBookmarkBulkURL = `/bookmarks/removeBulk/${sentenceListID}/`;

    // we're forced to use POST as DELETE doesn't support a body
    return getAxios(token)
        .post(removeBookmarkBulkURL, {
            cardIDs: cardIDs.map(toString),
        })
        .then((response) => response.data);
}
