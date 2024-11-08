import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { toast } from 'react-toastify'

const AdminGuard = ({ children }) => {
    const { authUser } = useAuthContext()

    if (!authUser || authUser.role !== 'admin') {
        toast.error('You do not have permission to access this page')
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminGuard
