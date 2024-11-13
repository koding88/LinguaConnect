import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosClient from '@/api/axiosClient'
import useLogin from '@/hooks/useLogin'
import { Mail, Lock, Loader2, ArrowRight, Search, KeyRound } from 'lucide-react'
import logo from '@/assets/logo.png'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useLogin()

    const [loginIdentifier, setLoginIdentifier] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            toast.error('Please enter your email address')
            return
        }
        setLoading(true)
        try {
            const response = await axiosClient.post('/auth/forgot-password', { email })
            toast.success(response.data.message)
            navigate('/forgot-password/recover', { state: { email } })
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
                            <KeyRound className="text-white w-10 h-10" />
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-center mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                                Find Your Account
                            </h2>
                            <p className="text-gray-500 text-sm text-center mb-6">
                                Enter your email to receive a password reset code
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
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
                                                <span>Searching...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Search className="h-4 w-4" />
                                                <span>Search Account</span>
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

export default ForgotPassword
