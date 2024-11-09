import './App.css'
import Router from './routes/Router'
import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CallContainer from '@/components/messages/call/CallContainer'

function App() {

    return (
        <>
            <Router />
            <CallContainer />
            <ToastContainer />
        </>
    )
}

export default App
