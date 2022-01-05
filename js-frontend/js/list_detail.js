const app = Vue.createApp({})


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


app.component('word-test', {
    data() {
        return {
            checked: false,
            userInput: null
        }
    },

    props: {
        word: String,
        sentence: String,
        translation: String
    },

    methods: {
        check() {
            if (this.checked) {
                alert("Already checked!")
                return
            }

            if (semanticallyEqual(this.userInput, this.sentence)) {
                alert("Correct!")
            } else {
                alert("Wrong!")
            }

            this.checked = true
        }
    },
    
    template: `
    <div class="word-test-div">
        <h2 v-show="this.checked">{{ sentence }}</h2>
        <p>{{ translation }}</p>

        <div class="word-test-buttons">
            <input @keyup.enter="check" v-model="userInput">
            <a @click="check">Check</a>
        </div>
    </div>
    `
})


app.mount('#content')
