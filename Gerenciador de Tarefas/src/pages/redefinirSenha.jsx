import { useState } from "react"
import axios from "axios"
import styles from "./css/redefinirSenha.module.css"

function RedefinirSenha(){

    const [ email, setEmail ] = useState("")
    const [ senha, setSenha ] = useState("")
    const [ reSenha, setReSenha ] = useState("")

    async function enviarDados(e){
        e.preventDefault();
        const dados = await axios.post("http://localhost:5000/receber",{
            email: email,
            senha: senha
        }, {headers:{
            "Content-Type": "application/json"
        }})
        if(!dados.data.user || !dados.data.user.id){
            console.log("Deu erro")
        }else{
            const novoUser = await axios.put(`http://localhost:5000/redefinir/${dados.data.user.id}`,{
                id:dados.data.user.id,
                email:email,
                senha: senha,
                reSenha:reSenha
            })
            console.log(novoUser.data)
        }
    }

    function valorEmail(event){
        setEmail(event.target.value)
    }
    function valorSenha(event){
        setSenha(event.target.value)
    }
    function valorReSenha(event){
        setReSenha(event.target.value)
    }

    return(
        <form autoComplete="off" onSubmit={enviarDados}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" value={email} onChange={valorEmail}/>
            <label htmlFor="senha">Redefinir Senha</label>
            <input type="password" id="senha" value={senha} onChange={valorSenha}/>
            <label htmlFor="reSenha">Confrimar Senha</label>
            <input type="password" id="reSenha" value={reSenha} onChange={valorReSenha}/>
            <input type="submit" id="submit" value="Redefinir Senha" />
        </form>
    )
}

export default RedefinirSenha

