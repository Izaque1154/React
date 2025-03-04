import { useState, useEffect } from "react";
import styles from "./css/tarefas.module.css";
import axios from "axios";

function Tarefas() {
    const [tarefa, setTarefa] = useState("");
    const [tarefas, setTarefas] = useState([]);
    const [editar, setEditar] = useState(null);
    const [novaTarefa, setNovaTarefa] = useState([]);
    const [riscarTarefa, setRiscarTarefa] = useState([]);

    useEffect(() => {
        chamarTarefas();
    }, []);

    async function chamarTarefas() {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post("https://react-t6ou.onrender.com/tarefas/pegar", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTarefas(response.data);
            setNovaTarefa(response.data);
            setRiscarTarefa(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    }

    function newTarefa(event) {
        setTarefa(event.target.value);
    }

    async function adicionarTarefa() {
        const token = localStorage.getItem("token");
        if (tarefa !== "") {
            await axios.post("https://react-t6ou.onrender.com/tarefas", { tarefa }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            setRiscarTarefa([...riscarTarefa, false]);
            setNovaTarefa([...novaTarefa, tarefa]);
            setTarefa("");
            chamarTarefas();
        } else {
            alert("não deixe os campos vazios");
        }
    }

    function editarTarefas(index) {
        setEditar(index);
    }

    async function salvarEdicao(index) {
        const token = localStorage.getItem("token");
        const tarefaEditada = novaTarefa[index];
        if (tarefaEditada.tarefa !== "") {
            await axios.put(`https://react-t6ou.onrender.com/editar/${tarefaEditada.id}`, { tarefa: tarefaEditada.tarefa }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            chamarTarefas();
            setEditar(null);
        } else {
            alert("Não deixe o campo vazio!");
        }
    }

    async function excluirTarefa(index) {
        const token = localStorage.getItem("token");
        await axios.delete(`https://react-t6ou.onrender.com/deletar/${tarefas[index].id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        chamarTarefas();
    }

    async function riscar(index) {
        try {
            const token = localStorage.getItem("token");
            const novasTarefas = riscarTarefa.map((t, i) =>
                index === i ? { ...t, concluida: !t.concluida } : t
            );
            const tarefaAtualizada = novasTarefas[index];
            setRiscarTarefa(novasTarefas);

            await axios.put(`https://react-t6ou.onrender.com/riscar/${tarefaAtualizada.id}`, { concluida: tarefaAtualizada.concluida }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            chamarTarefas();
        } catch (error) {
            console.error("Erro ao riscar a tarefa:", error);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>Tarefas</h1>
            <input
                className={styles.input}
                type="text"
                id="tarefas"
                autoComplete="off"
                value={tarefa}
                onChange={newTarefa}
                onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  adicionarTarefa();
                }
              }}
            />
            <button onClick={adicionarTarefa} className={styles.button}>Adicionar</button>
            <div className={styles.div}>
                {tarefas.map((t, i) => (
                    <div className={styles.tarefaItem} key={i}>
                        {editar === i ? (
                            <input className={styles.input}
                                type="text"
                                value={novaTarefa[i]?.tarefa || ""}
                                onChange={(e) =>
                                    setNovaTarefa(novaTarefa.map((t, index) =>
                                        index === i ? { ...t, tarefa: e.target.value } : t
                                    ))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      salvarEdicao(i); // Chama a função para adicionar a tarefa
                                    }
                                  }}
                            />
                        ) : (
                            <p
                                className={riscarTarefa[i].concluida ? styles.riscar : styles.pointer}
                                onClick={() => riscar(i)}
                            >
                                {t.tarefa}
                            </p>
                        )}
                        {editar === i ? (
                            <button onClick={() => salvarEdicao(i)} className={styles.button}>Salvar</button>
                        ) : (
                            <button onClick={() => editarTarefas(i)} className={styles.button}>Editar</button>
                        )}
                        <button onClick={() => excluirTarefa(i)} className={styles.button}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tarefas;
