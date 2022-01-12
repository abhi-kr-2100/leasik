const app = Vue.createApp({
    data() {
        const currentQuestion = question_list[0]
        const currentSentence = currentQuestion.sentence
        const words = currentSentence.split(" ")

        return {
            hasNextPage: hasNextPage,

            questions: question_list,
            currentQuestionIndex: 0,

            missingWordIndex: Math.floor(Math.random() * words.length),
            
            userEnteredAnswer: '',
            isCurrentAnswerChecked: false,
            answerCorrectness: 'unknown',

            resultsPosted: false,

            preQuestionSetup() {
                const currentQuestion = this.questions[
                    this.currentQuestionIndex]
                const currentSentence = currentQuestion.sentence
                const words = currentSentence.split(" ");
    
                this.missingWordIndex = Math.floor(Math.random() * words.length)
            }
        }
    },

    computed: {
        preBlank() {
            const currentQuestion = this.questions[this.currentQuestionIndex]
            const currentSentence = currentQuestion.sentence
            const words = currentSentence.split(' ')
            const wordsToInclude = words.slice(0, this.missingWordIndex)

            return wordsToInclude.join(' ')
        },

        postBlank() {
            const currentQuestion = this.questions[this.currentQuestionIndex]
            const currentSentence = currentQuestion.sentence
            const words = currentSentence.split(' ')
            const wordsToInclude = words.slice(this.missingWordIndex + 1)

            return wordsToInclude.join(' ')
        }
    },

    methods: {
        updateProficiency(currentQuestion) {
            const payload = {
                'id': currentQuestion.id
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
                this.updateProficiency(currentQuestion)
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

            this.preQuestionSetup()
        },

        finish() {
            if (this.resultsPosted) {
                return
            }

            this.resultsPosted = true
            alert('Quiz over.')
        },

        sumbitAnswer() {
            if (!this.isCurrentAnswerChecked) {
                this.checkAnswer()
            } else if (this.currentQuestionIndex < this.questions.length - 1) {
                this.showNextQuestion()
            } else if (this.hasNextPage) {
                document.getElementById('next-page-link').click()
            } else {
                this.finish()
            }
        }
    }
})


app.mount('#app')


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
