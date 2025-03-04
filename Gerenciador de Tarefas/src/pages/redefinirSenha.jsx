import { useState } from "react";
import axios from "axios";
import styles from "./css/redefinirSenha.module.css";
import { useNavigate } from "react-router-dom";

function RedefinirSenha() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [reSenha, setReSenha] = useState("");
    const navigate = useNavigate();

    async function enviarDados(e) {
        e.preventDefault();

        try {
            // Buscar usuário pelo email
            const { data } = await axios.post("https://react-6d0x.onrender.com/buscar", { email }, {
                headers: { "Content-Type": "application/json" }
            });

            // Redefinir senha
            await axios.put(`https://react-6d0x.onrender.com/redefinir/${data.id}`, {
                id: data.id,
                email,
                senha,
                reSenha
            });

            console.log("Senha redefinida com sucesso!");
            navigate("/login");

        } catch (error) {
            const mensagemErro = error.response?.data?.erro || "Este usuário não existe";
            console.error(mensagemErro);
            alert(mensagemErro);
        }
    }

    return (
       <div className={styles.div}>
            <h1 className={styles.h1}>Redefinir Senha</h1>
            <form autoComplete="off" onSubmit={enviarDados} className={styles.form}>
                <label htmlFor="email" className={styles.label}>E-mail</label>
                <input className={styles.input} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="senha" className={styles.label}>Redefinir Senha</label>
                <input className={styles.input} type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />

                <label htmlFor="reSenha" className={styles.label}>Confirmar Senha</label>
                <input className={styles.input} type="password" id="reSenha" value={reSenha} onChange={(e) => setReSenha(e.target.value)} required />

                <input className={styles.input} type="submit" id="submit" value="Redefinir Senha" />
            </form>
        </div>
    );
}

export default RedefinirSenha;