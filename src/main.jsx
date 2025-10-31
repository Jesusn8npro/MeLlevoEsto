import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProveedorAutenticacion } from './contextos/ContextoAutenticacion'
import { ProveedorTema } from './contextos/ContextoTema'
import App from './App.jsx'
import './estilos/index.css'

// Importar script de prueba para Supabase (solo en desarrollo)
if (import.meta.env.DEV) {
  import('./utils/test-supabase-insert.js');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter 
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <ProveedorTema>
      <ProveedorAutenticacion>
        <App />
      </ProveedorAutenticacion>
    </ProveedorTema>
  </BrowserRouter>,
)

