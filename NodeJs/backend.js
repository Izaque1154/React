const express = require("express");
const cors = require('cors');
const usuarios = require("./banco")
const axios = require("axios");
const { where } = require("sequelize");

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
app.post('/api', (req, res) => {
        const { nome, email, senha} = req.body;
        usuarios.create({
            nome: nome,
            email:email,
            senha:senha
        }).then(() => console.log("usuarios criado com sucesso!"));
        res.json({message:`nome: ${nome}, email: ${email}, senha:${senha}`});
    });

app.post('/receber', async (req, res) => {
    console.log("Dados enviados: ", req.url)
    const { email, senha } = req.body;
    const user = await usuarios.findOne({
        where:{
            email:email
        }
    })

    res.json({user})
})

app.put('/redefinir/:id', async (req, res) =>{
    const id = parseInt(req.params.id)
    const { email, senha, reSenha } = req.body
    if(senha !== reSenha) {
        res.send("As senhas não coincidem")
    }

    await usuarios.update({senha}, {where: {id}})
    const user = await usuarios.findByPk(id)
    res.json({user})
})

const porta = 5000
app.listen(porta, () => console.log(`Server rodando na porta: ${porta}`))

