const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("usuarios_cadastro", "root", "@Izaque1154", {
    host:"localhost",
    dialect:"mysql"
})

const usuarios = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    senha: Sequelize.CHAR(60)
})

sequelize.sync()
/*sequelize.query("CREATE DATABASE IF NOT EXISTS usuarios_cadastro;")
.then(() => console.log("Banco de dados criado com sucesso"))
.catch((error) => console.log("Erro ao criar banco, erro: ", error))
*/

module.exports = usuarios