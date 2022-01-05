const app = Vue.createApp({})


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

            if (this.userInput === this.sentence) {
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
            <input v-model="userInput">
            <a @click="check">Check</a>
        </div>
    </div>
    `
})


app.mount('#content')
