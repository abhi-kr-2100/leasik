const app = Vue.createApp({
    data() {
        const currentQuestion = question_list[0]
        const currentSentence = currentQuestion.sentence
        const words = currentSentence.split(" ")

        return {
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
        checkAnswer() {
            if (this.userEnteredAnswer.trim() === '') {
                return
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
                currentQuestion.score = 1
            } else {
                this.answerCorrectness = 'incorrect'
            }

            this.isCurrentAnswerChecked = true
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

            let payloadData = []
            for (let question of this.questions) {
                if (question.score) {
                    payloadData.push({
                        'text': question.sentence,
                        'translation': question.translation,
                    })
                }
            }

            console.log(payloadData)
            
            const payload = {
                'data': payloadData
            }

            const headers = {
                'X-CSRFToken': csrftoken
            }

            axios({
                method: 'POST',
                url: updateProficiencyPostURL,
                headers: headers,
                data: payload
            }).then(res => {
                this.resultsPosted = true
                alert('Quiz over!')
            }).catch(err => alert('Something went wrong. Please try again.'))
        },

        sumbitAnswer() {
            if (!this.isCurrentAnswerChecked) {
                this.checkAnswer()
            } else if (this.currentQuestionIndex < this.questions.length - 1) {
                this.showNextQuestion()
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
