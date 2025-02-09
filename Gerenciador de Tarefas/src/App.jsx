import "./App.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"


function App(){
    const navigate = useNavigate()

    function gerenciador(){
        navigate('/gerenciador')
    }
    function cadastro(){
        navigate("/cadastro")
    }
    function login(){
        navigate("/login")
    }
    
    return (
        <nav className="container"> 
            <a onClick={gerenciador}>Gerenciador</a>
            <a onClick={cadastro}>Cadastrar</a>
            <a onClick={login}>Login</a>
        </nav>
    )
}

export default App

