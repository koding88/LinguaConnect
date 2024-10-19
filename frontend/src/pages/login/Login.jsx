import React, { useState } from 'react';
import logo from '@/assets/logo.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import useLogin from '@/hooks/useLogin';

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const googleUrl = 'http://localhost:3000/api/v1/auth/google'

    const { login, loading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(identifier, password);
    }

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='w-full max-w-md bg-white rounded-lg border-[1px] border-[#D5D5D5] p-6 sm:p-8'>
                <div className="flex justify-center mb-3">
                    <img src={logo} className="h-20 w-auto sm:h-24" alt="Lingua Connect" />
                </div>
                <h2 className='text-2xl font-bold text-center mb-3'>Sign in to Lingua Connect</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input type="text" placeholder="Email or Username" className="w-full" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                    </div>
                    <div>
                        <Input type="password" placeholder="Password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Loading...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>
                    <div className="flex justify-end text-sm">
                        <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
                    </div>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                <div className="space-y-4">
                    <a
                        href={googleUrl}
                        className="w-full flex items-center justify-center space-x-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <FcGoogle className="text-xl" />
                        <span>Continue with Google</span>
                    </a>
                    <Link to="/register" className="w-full flex items-center justify-center space-x-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        <FaRegUserCircle className="text-xl" />
                        <span>Create new account</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
