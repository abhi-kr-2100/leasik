const app = Vue.createApp({
    data() {
        return {
            questions: question_list,
            currentQuestion: 0
        }
    },

    methods: {
        showNextQuestion() {
            ++this.currentQuestion
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
