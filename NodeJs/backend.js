// Importação dos pacotes necessários
const express = require("express");
const cors = require('cors');
const { usuarios, tarefas } = require("./banco");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
require("dotenv").config();

// Configuração do Express
const app = express();
app.use(cors({
    origin: "*", 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticação
function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Token não encontrado ou inválido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        console.log(decoded)
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido!" });
    }
}

// Rotas de Usuário
app.post('/api', (req, res) => {
    const { nome, email, senha } = req.body;
    usuarios.create({
        nome: nome,
        email: email,
        senha: senha
    }).then(() => console.log("Usuário criado com sucesso!"));
    res.json({ message: `nome: ${nome}, email: ${email}, senha: ${senha}` });
});

// Rota para criar tarefas (requisição autenticada)
app.post("/tarefas", checkToken, async (req, res) => {
    console.log(req.body); // Verifique o conteúdo do corpo da requisição
    const tarefa = req.body.tarefa;
    console.log("valor da tarefa: " ,tarefa)

    if (!tarefa) {
        return res.status(400).json({ msg: "Tarefa não pode ser vazia" });
    }

    try {
        await tarefas.create({
            usuarioId: req.user.id,
            tarefas: tarefa
        });
        console.log("Tarefa criada com sucesso!");
        res.status(201).json({ msg: "Tarefa criada com sucesso", tarefa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Erro ao criar tarefa", error });
    }
});
app.post("/tarefas/pegar", checkToken, async (req, res) => {
    try {
        const tarefasUsuario = await tarefas.findAll({ 
            where: { usuarioId: req.user.id } 
        });

        res.status(200).json(tarefasUsuario);
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        res.status(500).json({ msg: "Erro ao buscar tarefas", error });
    }
});
app.put("/editar/:id", checkToken, async(req, res) => {
    const id = parseInt(req.params.id)
    const { tarefas } = req.body
    console.log(id)
    console.log(tarefas)

    if(!id){
        res.status(401).json({ msg: "Id não foi passado" })
    }
    await tarefas.update({ tarefas }, { where: { id, usuarioId: req.user.id }})
})
// Rota para autenticação e geração de token JWT
app.post('/receber', async (req, res) => {
    const secret = process.env.SECRET;
    const { email, senha } = req.body;

    console.log("Email recebido:", email); // Adicionando log para verificar o email recebido

    const user = await usuarios.findOne({ where: { email: email } });
    if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado!" });
    }

    const senhaCorreta = await (senha, user.senha);
    if (!senhaCorreta) {
        return res.status(401).json({ error: "Senha incorreta!" });
    }

    try {
        const token = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },
            secret,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        console.log("Erro na geração do token:", error);
        res.status(500).json({ error: "Erro ao gerar token" });
    }
});

// Rota para redefinir a senha do usuário
app.put('/redefinir/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { email, senha, reSenha } = req.body;

    if (senha !== reSenha) {
        return res.status(400).send("As senhas não coincidem");
    }

    await usuarios.update({ senha }, { where: { id } });
    const user = await usuarios.findByPk(id);
    res.json({ user });
});

// Definir a porta e iniciar o servidor
const porta = 5000;
app.listen(porta, () => console.log(`Server rodando na porta: ${porta}`));