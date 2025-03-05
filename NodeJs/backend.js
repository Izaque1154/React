// Importação dos pacotes necessários
const express = require("express");
const bcrypt = require("bcryptjs")
const cors = require("cors");
const { usuarios, tarefas } = require("./banco");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

// Configuração do Express
const app = express();
app.use(cors({
    origin: "https://izaque1154.github.io",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Autenticação
function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Token não encontrado ou inválido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ msg: "Token inválido!" });
    }
}

// Usuário cadastro
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Falha na requisição" });
    }

    const usuarioExistente = await usuarios.findOne({ where: { email } });

    if (usuarioExistente) {
        return res.status(401).json({ erro: "Usuário já existe!" });
    }
    
    const crypt = await bcrypt.hash(senha, 10)
    console.log("Senha hash: ", crypt)

    await usuarios.create({ nome, email, senha: crypt });
    console.log("Usuário criado com sucesso!");

    try {
        const resposta = await axios.post("https://react-t6ou.onrender.com/login", { email, senha }, {
            headers: { "Content-Type": "application/json" }
        });
        res.json({ token: resposta.data.token });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao logar automaticamente" });
    }
});

// Login e Autenticação
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Falha na requisição" });
    }

    const user = await usuarios.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ erro: "E-mail incorreto" });
    }

    const resultado = await bcrypt.compare(senha, user.senha)
    if(!resultado){
        return res.status(401).json({erro: "Senha incorreta"})
    }
    console.log("Secret: ", process.env.SECRET)

    try {
        const token = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email },
            process.env.SECRET,
            { expiresIn: "24h" }
        );
        res.json({ token });
    } catch(error) {
        res.status(500).json({ erro: "Erro ao gerar token" });
        console.log(error)
    }
});

// Tarefas
app.post("/tarefas", checkToken, async (req, res) => {
    const { tarefa } = req.body;

    if (!tarefa) {
        return res.status(400).json({ msg: "Tarefa não pode ser vazia" });
    }

    try {
        await tarefas.create({ usuarioId: req.user.id, tarefa });
        res.status(201).json({ msg: "Tarefa criada com sucesso", tarefa });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao criar tarefa", error });
    }
});

app.post("/tarefas/pegar", checkToken, async (req, res) => {
    try {
        const tarefasUsuario = await tarefas.findAll({ where: { usuarioId: req.user.id } });
        res.status(200).json(tarefasUsuario);
    } catch (error) {
        res.status(500).json({ msg: "Erro ao buscar tarefas", error });
    }
});

app.put("/editar/:id", checkToken, async (req, res) => {
    const { id } = req.params;
    const { tarefa } = req.body;

    if (!id) {
        return res.status(401).json({ msg: "ID não foi passado" });
    }

    await tarefas.update({ tarefa }, { where: { id, usuarioId: req.user.id } });
    const task = await tarefas.findByPk(id);
    res.json(task);
});

app.delete("/deletar/:id", checkToken, async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(401).json({ msg: "ID não foi passado" });
    }

    await tarefas.destroy({ where: { id } });
    res.status(200).json({ msg: "Tarefa excluída com sucesso!" });
});

app.put("/riscar/:id", checkToken, async (req, res) => {
    const { id } = req.params;
    const { concluida } = req.body;

    if (!id) {
        return res.status(401).json({ msg: "ID não foi passado" });
    }

    await tarefas.update({ concluida }, { where: { id, usuarioId: req.user.id } });
    const task = await tarefas.findByPk(id);
    res.json(task);
});

// redefinir senha
app.put("/redefinir/:id", async (req, res) => {
    const { id } = req.params;
    const { email, senha, reSenha } = req.body;

    if (!email || !senha || !reSenha) {
        return res.status(400).json({ erro: "Erro na requisição" });
    }

    if (senha !== reSenha) {
        return res.status(401).json({ erro: "As senhas não coincidem" });
    }

    try {
        const user = await usuarios.findOne({ where: { id, email } });
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado!" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        console.log("Hash redefinir:", senhaHash);

        await usuarios.update({ senha: senhaHash }, { where: { id } });

        const userAtualizado = await usuarios.findByPk(id, {
            attributes: { exclude: ["senha"] }
        });

        res.json({ mensagem: "Senha redefinida com sucesso!", user: userAtualizado });

    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
});

// buscar usuário
app.post("/buscar", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ erro: "Falha na requisição" });
    }

    try {
        const user = await usuarios.findOne({ where: { email } });
        res.json(user);
    } catch {
        res.status(500).json({ erro: "Usuário não encontrado!" });
    }
});

// Iniciando o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});