const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Configuração dos middlewares nativos do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let counts = { A: 0, B: 0, C: 0 };

app.post('/answer', (req, res) => {
    const answer = req.body.answer;
    if (counts.hasOwnProperty(answer)) {
        counts[answer]++;
    }
    const nextQuestion = req.body.nextQuestion;
    if (nextQuestion <= 13) {
        res.redirect(`/pergunta${nextQuestion}`);
    } else {
        res.redirect('/result');
    }
});

app.get('/result', (req, res) => {
    let maxCount = -1;
    let maxAnswer = '';
    for (let key in counts) {
        if (counts[key] > maxCount) {
            maxCount = counts[key];
            maxAnswer = key;
        }
    }
    res.redirect(`/resultadoNivel1/resultadoNivel1-${maxAnswer}.html`);
});

app.get('/', (req, res) => {
    res.redirect('/pergunta1');
});

for (let i = 1; i <= 13; i++) {
    app.get(`/pergunta${i}`, (req, res) => res.sendFile(path.join(__dirname, 'views', `pergunta${i}.html`)));
}

app.listen(port, () => {
    console.log(`Quiz app listening at http://localhost:${port}`);
});