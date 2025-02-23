import { useState, createContext, useContext } from "react";

// Criando o contexto
const TemaContext = createContext();

// Criando o Provider
export function TemaProvider({ children }) {
    const [tema, setTema] = useState("aqua");

    return (
        <TemaContext.Provider value={{ tema, setTema }}>
            {children}
        </TemaContext.Provider>
    );
}

// Criando um hook para facilitar o uso do contexto
export function useTema() {
    return useContext(TemaContext);
}

// Exportando o contexto para ser usado em useContext()
export default TemaContext;