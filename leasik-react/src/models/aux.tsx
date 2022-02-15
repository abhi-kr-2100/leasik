export type Sentence = {
    id: number
    text: string
    translation: string
    text_language: string
    translation_language: string
}

export type RawCard = {
    id: number
    repetition_number: number
    easiness_facotr: number
    inter_repetition_interval: string
    last_review_date: string
    note: string
    owner: {
        id: number
    }
    sentence: Sentence
    hidden_word_position: number
}
