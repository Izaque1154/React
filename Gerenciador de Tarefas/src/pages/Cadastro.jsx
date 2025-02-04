import "./cadastro.css"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Cadastro(){
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
        <form className="cad" onSubmit={dadosCadastro}>
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" value={nome} onChange={dadosNome} />
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" value={email} onChange={dadosEmail} />
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" value={senha} onChange={dadosSenha} />
            <input type="submit" name="submit" id="submit" />
        </form>
    )
}

export default Cadastro