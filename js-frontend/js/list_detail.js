const app = Vue.createApp({
    data() {
        return {
            questions: question_list,
            currentQuestion: 0,
            
            answer: '',
            isCurrentAnswerChecked: false,
            answerCorrectness: 'unknown'
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
            } else {
                this.answerCorrectness = 'incorrect'
            }

            this.isCurrentAnswerChecked = true
        },

        showNextQuestion() {
            ++this.currentQuestion
            this.answer = ''
            this.isCurrentAnswerChecked = false
            this.answerCorrectness = 'unknown'
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
