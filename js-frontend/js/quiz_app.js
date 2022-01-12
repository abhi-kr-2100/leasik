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
        }
    },

    computed: {
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
        currentQuestion() {
            return this.questions[this.currentQuestionIndex]
        },

        setMissingWordIndex() {
            const currentQuestion = this.questions[this.currentQuestionIndex]
            const currentSentence = currentQuestion.sentence
            const words = currentSentence.split(" ");

            this.missingWordIndex = Math.floor(Math.random() * words.length)
            this.missingWordIndexSetFor = this.currentQuestionIndex
        },

        checkAnswer() {
            if (this.userEnteredAnswer.trim() === '') {
                alert("Please enter something to check.")
            }

            const currentQuestion = this.questions[this.currentQuestionIndex]
            const currentSentence = currentQuestion.sentence
            const words = currentSentence.split(" ")
            const wordToGuess = words[this.missingWordIndex]

            const isCorrect = semanticallyEqual(
                this.userEnteredAnswer, wordToGuess
            )
            if (isCorrect) {
                this.answerCorrectness = 'correct'
                updateProficiency(currentQuestion)
            } else {
                this.answerCorrectness = 'incorrect'
            }

            this.isCurrentAnswerChecked = true
            // set input box to the correct answer
            this.userEnteredAnswer = wordToGuess
        },

        showNextQuestion() {
            ++this.currentQuestionIndex
            this.userEnteredAnswer = ''
            this.isCurrentAnswerChecked = false
            this.answerCorrectness = 'unknown'
        },

        sumbitAnswer() {
            if (!this.isCurrentAnswerChecked) {
                this.checkAnswer()
            } else if (this.currentQuestionIndex < this.questions.length - 1) {
                this.showNextQuestion()
            } else if (this.hasNextPage) {
                document.getElementById('next-page-link').click()
            } else {
                document.getElementById('finish-quiz').click()
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

function updateProficiency(sentence) {
    // send a POST request to Leasik's backend to update the given sentence's
    // proficiency

    const payload = {
        'id': sentence.id
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
    // remove punctuations and extra space, and lowercase the sentences

    sent1 = sent1
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                .replace(/\s{2,}/g," ")
                .toLowerCase()

    sent2 = sent2
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                .replace(/\s{2,}/g," ")
                .toLowerCase()

    return sent1 === sent2
}
