const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Arquivo onde os dados serão salvos
const dataFile = 'dados.json';

// Função para ler dados do arquivo
const readData = () => {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile);
        return JSON.parse(data);
    }
    return [];
};

// Função para salvar dados no arquivo
const saveData = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// Endpoint para receber dados
app.post('/enviar', (req, res) => {
    const dados = readData();
    dados.push(req.body);
    saveData(dados);
    res.status(200).send('Dados recebidos com sucesso');
});

// Endpoint para obter dados
app.get('/dados', (req, res) => {
    const dados = readData();
    res.status(200).json(dados);
});

// Endpoint para deletar dados
app.delete('/dados/:id', (req, res) => {
    const dados = readData();
    const { id } = req.params;
    if (id >= 0 && id < dados.length) {
        dados.splice(id, 1);
        saveData(dados);
        res.status(200).send('Dados deletados com sucesso');
    } else {
        res.status(400).send('ID inválido');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
