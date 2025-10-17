import React, { createContext, useContext, useState } from 'react'

// Crear el contexto
const ChatContext = createContext()

// Hook personalizado para usar el contexto
export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider')
  }
  return context
}

// Proveedor del contexto
export const ChatProvider = ({ children }) => {
  const [chatAbierto, setChatAbierto] = useState(false)

  const abrirChat = () => setChatAbierto(true)
  const cerrarChat = () => setChatAbierto(false)
  const alternarChat = () => setChatAbierto(!chatAbierto)

  const value = {
    chatAbierto,
    abrirChat,
    cerrarChat,
    alternarChat,
    setChatAbierto
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContext