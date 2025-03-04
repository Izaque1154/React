import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./css/cadastro.module.css";

function Cadastro() {
    const navigate = useNavigate();
    
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function dadosCadastro(e) {
        e.preventDefault();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            alert("O email precisa ser do tipo @gmail.com");
            return;
        }

        console.log(!email);
        
        const url = "https://react-t6ou.onrender.com/cadastro";
        const dados = { nome, email, senha };

        try {
            const resposta = await axios.post(url, dados, {
                headers: { "Content-Type": "application/json" }
            });

            if (resposta.data.erro) {
                console.log(resposta.data.erro);
            } else {
                console.log(resposta.data);
                localStorage.setItem("token", resposta.data.token);
                navigate("/tarefas");
            }
        } catch (error) {
            console.log("Erro: ", error);
        }
    }

    return (
        <div className={styles.div}>
            <h1 className={styles.h1}>Cadastro</h1>
            <form autoComplete="off" className={styles.cad} onSubmit={dadosCadastro}>
                <label htmlFor="nome" className={styles.label}>Nome</label>
                <input 
                    type="text" 
                    id="nome" 
                    className={styles.input} 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    autoComplete="off" 
                    required 
                />

                <label htmlFor="email" className={styles.label}>E-mail</label>
                <input 
                    type="email" 
                    id="email" 
                    className={styles.input} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    autoComplete="off" 
                    required 
                />

                <label htmlFor="senha" className={styles.label}>Senha</label>
                <input 
                    type="password" 
                    id="senha" 
                    className={styles.input} 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    autoComplete="off" 
                    required 
                />

                <input type="submit" className={styles.submit} id="submit" />
            </form>
        </div>
    );
}

export default Cadastro;