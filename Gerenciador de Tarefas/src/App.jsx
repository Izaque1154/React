import "./App.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"


function App(){
    const navigate = useNavigate()

    function home(){
        navigate('/Home')
    }
    function cadastro(){
        navigate("/cadastro")
    }
    function login(){
        navigate("/login")
    }
    
    return (
        <nav className="container"> 
            <a onClick={home}>Home</a>
            <a onClick={cadastro}>Cadastrar</a>
            <a onClick={login}>Login</a>
        </nav>
    )
}

export default App

