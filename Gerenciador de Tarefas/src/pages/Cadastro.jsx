import styles from "./css/cadastro.module.css"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Cadastro(){
    const navigate = useNavigate()

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    async function dadosCadastro(e) {
       e.preventDefault();

        const url = "http://localhost:5000/api";
        const dados = {
            nome: nome,
            email: email,
            senha: senha 
        };
        try{
            const resposta = await axios.post(url, dados, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(resposta.data)
            navigate("/tarefas")
        }catch(error){
            console.log("Erro: ", error)
        }
    }

    //Pegando dados do formulário
    function dadosNome(event) {
        setNome(event.target.value)
    }
    function dadosEmail(event) {
        setEmail(event.target.value)
    }
    function dadosSenha(event) {
        setSenha(event.target.value)
    }

    return(
        <form autoComplete="off" className={styles.cad} onSubmit={dadosCadastro}>
            <label htmlFor="nome" className={styles.label}>Nome</label>
            <input type="text" id="nome" className={styles.input} value={nome} onChange={dadosNome} />
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input type="email" id="email" className={styles.input} value={email} onChange={dadosEmail} />
            <label htmlFor="senha"className={styles.label}>Senha</label>
            <input type="password" id="senha" className={styles.input} value={senha} onChange={dadosSenha} />
            <input type="submit" className={styles.submit} id="submit"/>
        </form>
    )
}

export default Cadastro