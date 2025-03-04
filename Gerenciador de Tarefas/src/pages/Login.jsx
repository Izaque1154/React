import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./css/login.module.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    function valorEmail(event) {
        setEmail(event.target.value);
    }

    function valorSenha(event) {
        setSenha(event.target.value);
    }

    function redefinirSenha() {
        navigate("/redefinirSenha");
    }

    async function enviarDados(e) {
        e.preventDefault();

        try {
            const url = "https://react-t6ou.onrender.com/login";
            const dados = { email, senha };

            const resposta = await axios.post(url, dados, {
                headers: { "Content-Type": "application/json" }
            });

            if (resposta.data.token) {
                localStorage.setItem("token", resposta.data.token);
                console.log("Token salvo:", resposta.data.token);
            } else {
                console.error("Erro: Token não recebido!");
                navigate("/erro");
            }
            
            navigate("/tarefas");
        } catch (error) {
            console.log("Erro ao fazer login: ", error.message);
            alert("Email ou senha incorretos");
        }
    }

    return (
        <div className={styles.div}>
            <h1 className={styles.h1}>Login</h1>
            <form className={styles.form} autoComplete="off" onSubmit={enviarDados}>
                <label htmlFor="email" className={styles.label}>E-mail</label>
                <input 
                    type="email" 
                    id="email" 
                    className={styles.input} 
                    value={email} 
                    onChange={valorEmail} 
                    required 
                    autoComplete="off" 
                />

                <label htmlFor="senha" className={styles.label}>Senha</label>
                <input 
                    type="password" 
                    id="senha" 
                    className={styles.input} 
                    value={senha} 
                    onChange={valorSenha} 
                    required 
                    autoComplete="off" 
                />

                <input type="submit" className={styles.submit} id="submit" />

                <a onClick={redefinirSenha} className={styles.a}>Esqueceu sua Senha?</a>
            </form>
        </div>
    );
}

export default Login;