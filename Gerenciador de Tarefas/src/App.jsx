import styles from './App.module.css'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"


function App(){
    const navigate = useNavigate()

    function tarefas(){
        navigate('/tarefas')
    }
    function cadastro(){
        navigate("/cadastro")
    }
    function login(){
        navigate("/login")
    }
    function teste(){
        navigate("/teste")
    }
    
    return (
        <nav className={styles.container}> 
            <a onClick={tarefas} className={styles.a} >Tarefas</a>
            <a onClick={cadastro} className={styles.a} >Cadastrar</a>
            <a onClick={login} className={styles.a} >Login</a>
            <a onClick={teste} className={styles.a}>Teste</a>
        </nav>
    )
}

export default App

