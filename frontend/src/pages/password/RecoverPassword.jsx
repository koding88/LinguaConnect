import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient from '@/api/axiosClient'
import useLogin from '@/hooks/useLogin'
import { Mail, Lock, Loader2, ArrowRight, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import logo from '@/assets/logo.png'

const RecoverPassword = () => {
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email
    const { login } = useLogin()

    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [loginIdentifier, setLoginIdentifier] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
        setOtp(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast.error('OTP must be 6 digits')
            return
        }
        if (!newPassword || !confirmPassword) {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
            <header className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="h-8 w-8" />
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Lingua Connect
                        </h1>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full md:w-auto">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Email or Username"
                                className="pl-10 pr-4 py-2 w-full md:w-auto border-gray-200"
                                value={loginIdentifier}
                                onChange={(e) => setLoginIdentifier(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="password"
                                placeholder="Password"
                                className="pl-10 pr-4 py-2 w-full md:w-auto border-gray-200"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            disabled={loginLoading}
                        >
                            {loginLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Sign in</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="relative h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('/patterns/pattern-1.svg')] opacity-30"></div>
                            <ShieldCheck className="text-white w-10 h-10" />
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-center mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                                Reset Your Password
                            </h2>
                            <p className="text-gray-500 text-sm text-center mb-6">
                                Enter the OTP sent to your email and create a new password
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        placeholder="Enter 6-digit OTP code"
                                        className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-300 text-center font-mono text-lg tracking-widest"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                        {otp.length}/6
                                    </div>
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New password"
                                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-end">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-center"
                                    >
                                        Cancel
                                    </Link>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-200"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Resetting...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4" />
                                                <span>Reset Password</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RecoverPassword
