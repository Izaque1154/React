const express = require("express");
const cors = require('cors');
const axios = require("axios")

//config do APP
const app = express();
app.use(cors({
    origin: "*", 
    methods: "GET,POST,PUT,DELETE",  
    allowedHeaders: "Content-Type"
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Rotas
app.post('/api', async (req, res) => {
    try{
        console.log("URL completa:", req.url); 
        console.log("body Params:", req.body); 
        const { nome, email, senha} = req.body
        res.json({message:`nome: ${nome}, email: ${email}, senha:${senha}`})
        await axios.get(`http://localhost:5000/receber?nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`)
    }catch(error){
        console.log("Erro: ", error)
    }
});

app.get("/receber", (req, res) => {
    const { nome, email, senha } = req.query;
    res.send()
})

const porta = 5000
app.listen(porta, () => console.log(`Server rodando na porta: ${porta}`))

