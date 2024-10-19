import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient from '@/api/axiosClient'
import useLogin from '@/hooks/useLogin'

const RecoverPassword = () => {
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email
    const { login } = useLogin()

    const [loginIdentifier, setLoginIdentifier] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!otp || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields')
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        setLoading(true)
        try {
            const response = await axiosClient.post(`/auth/reset-password?email=${email}&otp=${otp}`, { newPassword })
            toast.success(response.data.message)
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoginLoading(true)
        try {
            await login(loginIdentifier, loginPassword)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            setLoginLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="p-4 border-b">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-xl font-bold mb-4 md:mb-0">Lingua Connect</h1>
                    <form onSubmit={handleLogin} className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full md:w-auto">
                        <Input
                            type="text"
                            placeholder="Email or Username"
                            className="border rounded px-2 py-1 w-full md:w-auto"
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="border rounded px-2 py-1 w-full md:w-auto"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="bg-black text-white px-4 py-1 rounded w-full md:w-auto" disabled={loginLoading}>
                            {loginLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Reset your password</h2>
                        <Input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full border rounded px-3 py-2 mb-4"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="New password"
                            className="w-full border rounded px-3 py-2 mb-4"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full border rounded px-3 py-2 mb-4"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-end">
                            <Link to="/login" className="px-4 py-2 bg-white border rounded text-gray-600 hover:bg-gray-100 w-full sm:w-auto inline-block text-center">
                                Cancel
                            </Link>
                            <Button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 w-full sm:w-auto" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default RecoverPassword
