import { Sentence, RawCard } from './aux'


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

export interface Card extends RawCard {
    sentence: Sentence & { bookmarked: boolean }
}
