'use strict'

const app = Vue.createApp({
    data() {
        return {
            hasNextPage: hasNextPage,

            questions: question_list,
            currentQuestionIndex: 0,

            // what's the most recent question index for which missingWordIndex
            // has been set?
            missingWordIndexSetFor: undefined,
            missingWordIndex: undefined,
            
            userEnteredAnswer: '',
            isCurrentAnswerChecked: false,
            answerCorrectness: 'unknown',
            audioPlayed: false,

            note: question_list[0].note,
            voices: [],
            selectedLanguage: undefined
        }
    },

    computed: {
        speechSynthesisAvailable() {
            const available = ('speechSynthesis' in window)
            if (available) {
                window.speechSynthesis.onvoiceschanged = this.populateVoices
            }

            return available
        },

        preBlank() {
            if (this.missingWordIndexSetFor !== this.currentQuestionIndex) {
                this.setMissingWordIndex()
            }

            const question = this.currentQuestion()
            return wordSlice(question.sentence, this.missingWordIndex, 'pre')
        },

        postBlank() {
            if (this.missingWordIndexSetFor !== this.currentQuestionIndex) {
                this.setMissingWordIndex()
            }

            const question = this.currentQuestion()
            return wordSlice(question.sentence, this.missingWordIndex, 'post')
        }
    },

    methods: {
        populateVoices() {
            const voices = window.speechSynthesis.getVoices()
            
            for (let i = 0; i < voices.length; ++i) {
                this.voices.push({ 'id': i, 'lang': voices[i].lang })
            }
        },

        bookmarkSentence() {
            const currentSentenceID = this.currentQuestion().id
            addBookmark(currentSentenceID)
        },

        currentQuestion() {
            return this.questions[this.currentQuestionIndex]
        },

        setMissingWordIndex() {
            const currentSentence = this.currentQuestion().sentence
            const words = currentSentence.split(' ');

            this.missingWordIndex = Math.floor(Math.random() * words.length)
            this.missingWordIndexSetFor = this.currentQuestionIndex
        },

        playAudio() {
            const text = this.currentQuestion().sentence
            let utterence = new SpeechSynthesisUtterance(text)
            utterence.lang = this.selectedLanguage
            utterence.rate = 0.75

            console.log(utterence)

            window.speechSynthesis.speak(utterence)
            this.audioPlayed = true
        },

        changeSelectedLanguage(event) {
            const options = event.target.options
            return (this.selectedLanguage = options[options.selectedIndex].text)
        },

        checkAnswer() {
            if (this.userEnteredAnswer.trim() === '') {
                alert('Please enter something to check.')
            }

            const currentSentence = this.currentQuestion().sentence
            const words = currentSentence.split(' ')
            const correctAnswer = words[this.missingWordIndex]

            if (semanticallyEqual(this.userEnteredAnswer, correctAnswer)) {
                this.answerCorrectness = 'correct'
                if (this.audioPlayed) {
                    this.currentQuestion().score = 1
                } else {
                    this.currentQuestion().score = 5
                }
            } else {
                this.answerCorrectness = 'incorrect'
                this.currentQuestion().score = 0
            }

            updateProficiency(this.currentQuestion())

            this.isCurrentAnswerChecked = true
            // set input box to the correct answer
            this.userEnteredAnswer = correctAnswer
        },

        showNextQuestion() {
            ++this.currentQuestionIndex
            this.userEnteredAnswer = ''
            this.isCurrentAnswerChecked = false
            this.answerCorrectness = 'unknown'
            this.note = this.currentQuestion().note
            this.audioPlayed = false
        },

        sumbitAnswer() {
            if (this.currentQuestion().note.trim() !== this.note.trim()) {
                updateNote(this.currentQuestion(), this.note)
                this.currentQuestion().note = this.note.trim()
            }

            if (!this.isCurrentAnswerChecked) {
                this.checkAnswer()
            } else if (this.currentQuestionIndex < this.questions.length - 1) {
                this.showNextQuestion()
            } else if (this.hasNextPage) {
                window.location.href = nextPageURL
            } else {
                window.location.href = quizFinishRedirectURL
            }
        }
    }
})


app.mount('#app')


function wordSlice(text, index, pre_or_post) {
    // return the initial part of text (pre) or the latter part of text (post)
    // index is the index of the word that is either the last or the first to
    // not be included

    const words = text.split(' ')
    const wordsToInclude = (pre_or_post === 'pre') ? words.slice(0, index)
        : words.slice(index + 1)

    return wordsToInclude.join(' ')
}


function addBookmark(sentenceID) {
    // send a POST request to Leasik's backend to add the sentence with the
    // given ID to the current list's bookmarks

    const payload = {
        'sentence_id': sentenceID,
        'list_id': listID
    }

    const headers = {
        'X-CSRFToken': csrftoken
    }

    axios({
        method: 'POST',
        url: bookmarkURL,
        headers: headers,
        data: payload
    }).catch(err => alert(`Something went wrong: ${err}`))
}


function updateNote(sentence, new_note) {
    // send a POST request to Leasik's backend to update the note for the given
    // sentence

    const payload = {
        'id': sentence.id,
        'new_note': new_note
    }

    const headers = {
        'X-CSRFToken': csrftoken
    }

    axios({
        method: 'POST',
        url: updateNoteURL,
        headers: headers,
        data: payload
    }).catch(err => alert(`Something went wrong: ${err}`))
}


function updateProficiency(sentence) {
    // send a POST request to Leasik's backend to update the given sentence's
    // proficiency

    const payload = {
        'id': sentence.id,
        'score': sentence.score
    }

    const headers = {
        'X-CSRFToken': csrftoken
    }

    axios({
        method: 'POST',
        url: updateProficiencyPostURL,
        headers: headers,
        data: payload
    }).catch(err => alert(`Something went wrong: ${err}`))
}


function semanticallyEqual(sent1, sent2) {
    return normalizeSentence(sent1) === normalizeSentence(sent2)
}


function normalizeSentence(sentence) {
    return (
        sentence
            .replace(/[^\p{L}\s]/gu, '')
            .replace(/\s{2,}/g, ' ')
            .toLowerCase()
    )
}
