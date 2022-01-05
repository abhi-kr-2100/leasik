const app = Vue.createApp({})


app.component('word-test', {
    props: ['word', 'sentence', 'translation'],
    template: `
    <div class="word-test-div">
        <h2>{{ sentence }}</h2>
        <p>{{ translation }}</p>

        <div class="word-test-buttons">
            <a>Check</a>
        </div>
    </div>
    `
})


app.mount('#content')
