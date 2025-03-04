const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,   
    process.env.DB_USER,   
    process.env.DB_PASSWORD,  
    {
        host: process.env.DB_HOST,   
        dialect: "postgres",         
        port: process.env.DB_PORT || 5432,  
    }
);

// Modelo de usuários
const usuarios = sequelize.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    senha: Sequelize.STRING(255)
});

// Modelo de tarefas
const tarefas = sequelize.define('tarefas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: usuarios,
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    tarefa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    concluida: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

// Associação entre usuários e tarefas
usuarios.hasMany(tarefas, { foreignKey: 'usuarioId' });
tarefas.belongsTo(usuarios, { foreignKey: 'usuarioId' });

// Sincronizando os modelos com o banco
sequelize.sync({ alter: true })
    .then(() => console.log("Tabelas sincronizadas com sucesso!"))
    .catch((error) => console.log("Erro ao sincronizar o banco de dados:", error));

module.exports = { usuarios, tarefas };
