import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Tarefas from './pages/Tarefas.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import RedefinirSenha from './pages/redefinirSenha.jsx'
import Erro  from './pages/erro.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/tarefas',
    element: <Tarefas />
  },
  {
    path: '/cadastro',
    element: <Cadastro />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: "/redefinirSenha",
    element: <RedefinirSenha/>
  },
  {
    path: "/erro",
    element: <Erro/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
