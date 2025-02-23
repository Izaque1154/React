import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/login.module.css"



function Login(){

    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    function clique(event){
        const evento = event.target.value;
        console.log("Jogar futebol mermão")
    }

    function valorEmail(event){
        setEmail(event.target.value)
    }
    function valorSenha(event){
        setSenha(event.target.value)
    }

    function redefinirSenha(){
        navigate('/redefinirSenha')
    }

    async function enviarDados(e) {
        e.preventDefault();
        try {
            const url = "http://localhost:5000/receber";
            const dados = { email, senha };  
    
            const resposta = await axios.post(url, dados, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (resposta.data.token) {
                localStorage.setItem("token", resposta.data.token);
                console.log("Token salvo:", resposta.data.token);
            } else {
                console.error("Erro: Token não recebido!");
            }
        } catch (error) {
            console.log("Erro ao fazer login:", error.response?.data || error);
        }
    }
    return(
        <form className={styles.form} autoComplete="off" onSubmit={enviarDados}>
            <label htmlFor="email"className={styles.label}>E-mail</label>
            <input type="email" id="email" className={styles.input} value={email} onChange={valorEmail} />
            <label htmlFor="senha" className={styles.label} >Senha</label>
            <input type="password" className={styles.input} id="senha" value={senha} onChange={valorSenha} />
            <input type="submit" className={styles.submit} id="submit" />
            <a onClick={redefinirSenha} className={styles.a} >Esqueceu sua Senha?</a>
        </form>
    )
}

export default Login