import { useState, useEffect } from "react"
import styles from  "./css/tarefas.module.css"
import axios, { Axios } from "axios"


function Tarefas(){

    const [ tarefa, setTarefa ] = useState("")
    const [ tarefas, setTarefas ] = useState([])
    const [ editar, setEditar ] = useState(null)
    const [ novaTarefa, setNovaTarefa ] = useState([])
    const [ riscarTarefa, setRiscarTarefa ] = useState([])


    async function chamarTarefas() {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.post("http://localhost:5000/tarefas/pegar", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTarefas(response.data) 
            console.log(response.data)// Supondo que o backend retorna um array de tarefas
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error)
        }
    }

    useEffect(() => {
        chamarTarefas()
    },[])

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
            chamarTarefas()
        }else{
            alert("Colocar valor direito")
        }
    }
    function editarTarefas(index) {
        setEditar(index)
    }
    async function salvarEdicao(index) {
        const setar = await axios.put("")
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
                        {editar === t.id ?(
                            <input type="text" value={novaTarefa[t.id].tarefas} onChange={(e) => setNovaTarefa(novaTarefa.map((t, index) => t.id === index ? e.target.value : t.tarefas))} />
                        ):(
                            <p className={ riscarTarefa[i] ? styles.riscar : styles.pointer} onClick={ ()=> {
                                setRiscarTarefa(riscarTarefa.map((t, index)=> i === index ? !t : t))
                            } }>{t.tarefas}</p>
                        )}
                        {editar === t.id ?(
                            <button onClick={()=> salvarEdicao(t.id)}>Salvar</button>
                        ):(
                            <button onClick={() => editarTarefas(t.id)}>Editar</button>
                        )}
                        <button onClick={()=>excluirTarefa(t.id)}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tarefas

