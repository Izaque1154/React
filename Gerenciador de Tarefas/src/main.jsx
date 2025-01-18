import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/Home',
    element: <Home />
  },
  {
    path: '/cadastro',
    element: <Cadastro />
  },
  {
    path: '/login',
    element: <Login />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
