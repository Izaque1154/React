import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css"



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
        e.preventDefault()
        try{
        const url = "http://localhost:5000/receber"
        const dados = {
            email: email,
        }
        const resposta = await axios.post(url, dados, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log("sucesso!", resposta.data)
    }
        catch{(error) => console.log("Erro: ", error)}
    }
    return(
        <form autoComplete="off" onSubmit={enviarDados}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" value={email} onChange={valorEmail} />
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" value={senha} onChange={valorSenha} />
            <input type="submit" id="submit" />
            <a onClick={redefinirSenha}>Esqueceu sua Senha?</a>
        </form>
    )
}

export default Login