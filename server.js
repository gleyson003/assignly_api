const express = require('express');
const app = express();

app.use(express.json()); // Permite trabalhar com JSON no body das requisições

// Rota inicial
app.get('/', (req, res) => {
    res.send('Bem-vindo à API Node.js!');
});

// Definir a porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
