import { RawCard } from './aux'


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

export type Card = RawCard & { isBookmarked: boolean }
