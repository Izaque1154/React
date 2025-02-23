import { useState, useEffect } from "react"
import styles from  "./css/tarefas.module.css"
import axios from "axios"


function Tarefas(){

    const [ tarefa, setTarefa ] = useState("")
    const [ tarefas, setTarefas ] = useState([])
    const [ editar, setEditar ] = useState(null)
    const [ novaTarefa, setNovaTarefa ] = useState([])
    const [ riscarTarefa, setRiscarTarefa ] = useState([])

    function newTarefa(event) {
        setTarefa(event.target.value)
    }

    async function adicionarTarefa(e) {
        const token = localStorage.getItem('token')

        if(tarefa !== ""){
            console.log(tarefa)
            const newTarefa = await axios.post("http://localhost:5000/tarefas", { tarefa: tarefa }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            } )
            setRiscarTarefa([...riscarTarefa, false])
            setNovaTarefa([...novaTarefa, tarefa])
            setTarefa("")
        }else{
            alert("Colocar valor direito")
        }
    }
    function editarTarefas(index) {
        setEditar(index)
    }
    function salvarEdicao(index) {
        if(novaTarefa[index] !== ""){
            const novasTarefas = tarefas.map((t, i) => i === index? novaTarefa[index] : t)
            setTarefas(novasTarefas)
            setEditar(null)
        }else{
            alert("Não deixa o campo vazio!")
        }
    }
    function excluirTarefa(index) {
        const newTarefa = tarefas.filter((_,i) => i !== index)
        const excluirTarefas = novaTarefa.filter((_,i) => i!== index) 
        setNovaTarefa(excluirTarefas)
        setTarefas(newTarefa) 
    }

    return(
        <div className={styles.container}>
            <input className={styles.input} type="text" id="tarefas" autoComplete="off" value={tarefa} onChange={newTarefa}/>
            <button onClick={adicionarTarefa}>Adicionar</button>
            <div>
                {tarefas.map((t, i) =>(
                    <div className={styles.tarefaItem} key={i}>
                        {editar === i ?(
                            <input type="text" value={novaTarefa[i]} onChange={(e) => setNovaTarefa(novaTarefa.map((t, index) => i === index ? e.target.value : t))} />
                        ):(
                            <p className={ riscarTarefa[i] ? styles.riscar : styles.pointer} onClick={ ()=> {
                                setRiscarTarefa(riscarTarefa.map((t, index)=> i === index ? !t : t))
                            } }>{t}</p>
                        )}
                        {editar === i ?(
                            <button onClick={()=> salvarEdicao(i)}>Salvar</button>
                        ):(
                            <button onClick={() => editarTarefas(i)}>Editar</button>
                        )}
                        <button onClick={()=>excluirTarefa(i)}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tarefas

