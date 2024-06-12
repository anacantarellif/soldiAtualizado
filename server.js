// Importa o framework Express, que é usado para criar o servidor
const express = require('express');

// Importa o módulo 'path' do Node.js, que fornece utilitários para lidar com caminhos de arquivos e diretórios
const path = require('path');

// Cria uma instância do aplicativo Express
const app = express();

// Define a porta em que o servidor irá ouvir as solicitações (3000 neste caso)
const PORT = 4000;

// Variável para armazenar as contagens de respostas dos usuários
let respostas = { A: 0, B: 0, C: 0 };

// Middleware para analisar corpos de solicitações URL-encoded e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para servir arquivos estáticos, como arquivos HTML, CSS e JavaScript
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Rotas para servir as páginas de perguntas (de 1 a 13)
for (let i = 1; i <= 13; i++) {
    // Define uma rota para cada pergunta, onde o número da pergunta é dinâmico (ex: /pergunta1, /pergunta2, etc.)
    app.get(`/pergunta${i}`, (req, res) => res.sendFile(path.join(__dirname, 'views', `pergunta${i}.html`)));
}

// Rotas para servir as páginas de resultados
app.get('/resultadoA', (req, res) => res.sendFile(path.join(__dirname, 'views', 'resultadoA.html')));
app.get('/resultadoB', (req, res) => res.sendFile(path.join(__dirname, 'views', 'resultadoB.html')));
app.get('/resultadoC', (req, res) => res.sendFile(path.join(__dirname, 'views', 'resultadoC.html')));

// Rota para lidar com a resposta do formulário enviado pelo usuário
app.post('/answer', (req, res) => {
    // Obtém a resposta selecionada pelo usuário e a próxima pergunta a ser exibida a partir do corpo da solicitação
    const answer = req.body.answer;
    const nextQuestion = parseInt(req.body.nextQuestion);

    // Incrementa a contagem da resposta selecionada
    if (respostas[answer] !== undefined) {
        respostas[answer]++;
    }

    // Redireciona para a próxima pergunta ou para a página de resultado final
    if (nextQuestion > 13) {
        // Determina a resposta mais escolhida e redireciona para a página de resultado correspondente
        const maxAnswer = Object.keys(respostas).reduce((a, b) => respostas[a] > respostas[b] ? a : b);
        return res.redirect(`/resultado${maxAnswer}`);
    } else {
        return res.redirect(`/pergunta${nextQuestion}`);
    }
});

// Rota para determinar o resultado final
app.get('/result', (req, res) => {
    let maxCount = -1;
    let maxAnswer = '';
    // Itera sobre as contagens de respostas para determinar a resposta mais escolhida
    for (let key in respostas) {
        if (respostas[key] > maxCount) {
            maxCount = respostas[key];
            maxAnswer = key;
        }
    }
    // Redireciona para a página de resultado correspondente à resposta mais escolhida
    res.redirect(`/resultado${maxAnswer}.html`);
});

// Redireciona para a primeira pergunta ao acessar a raiz do servidor
app.get('/', (req, res) => {
    res.redirect('/home.html');
});
// app.get('/', (req, res) => {
//     res.redirect('/pergunta1');
// });

// Inicia o servidor e faz com que ele comece a ouvir as solicitações na porta especificada, o 0.0.0.0 serve para ele ouvir em outros tipos de dispositivos, não apenas no localhost
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SOLDI app listening at http://localhost:${PORT}, SOLDI app listening at port ${PORT}`);
});