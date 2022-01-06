const app = Vue.createApp({
    data() {
        return {
            questions: question_list,
            currentQuestion: 0,
            
            answer: '',
            isCurrentAnswerChecked: false,
            answerCorrectness: 'unknown',

            resultsPosted: false
        }
    },

    methods: {
        checkAnswer() {
            if (this.answer.trim() === '') {
                return
            }

            const isCorrect = semanticallyEqual(
                this.answer, this.questions[this.currentQuestion].sentence)
            if (isCorrect) {
                this.answerCorrectness = 'correct'
                this.questions[this.currentQuestion].score = 1
            } else {
                this.answerCorrectness = 'incorrect'
            }

            this.isCurrentAnswerChecked = true
            this.answer = this.questions[this.currentQuestion].sentence
        },

        showNextQuestion() {
            ++this.currentQuestion
            this.answer = ''
            this.isCurrentAnswerChecked = false
            this.answerCorrectness = 'unknown'
        },

        finish() {
            if (this.resultsPosted) {
                return
            }

            let payloadData = []
            for (let question of this.questions) {
                if (question.score) {
                    payloadData.push({
                        'word_text': question.word_text,
                        'language': question.language,
                    })
                }
            }
            
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
            } else if (this.currentQuestion < this.questions.length - 1) {
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
