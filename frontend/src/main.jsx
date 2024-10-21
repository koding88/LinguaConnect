import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketContextProvider } from '@/context/SocketContext'
import { AuthContextProvider } from '@/context/AuthContext'

createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
        <SocketContextProvider>
            <App />
        </SocketContextProvider>
    </AuthContextProvider>
)
