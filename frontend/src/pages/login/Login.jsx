import React, { useState } from 'react';
import logo from '@/assets/logo.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import useLogin from '@/hooks/useLogin';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import {
    PiBookOpenTextLight,
    PiTranslateLight,
    PiChatCircleTextLight,
    PiUsersThreeLight,
    PiGlobeLight,
    PiMicrophoneStageLight,
    PiGameControllerLight,
    PiGraduationCapLight,
    PiNotebookLight,
    PiHeadphonesLight,
    PiVideoLight,
    PiChatsLight
} from "react-icons/pi";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const googleUrl = 'http://localhost:3000/api/v1/auth/google'
    const { login, loading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(identifier, password);
    }

    // Floating icons with different animations and colors
    const floatingIcons = [
        // Left side icons - Large screens (lg)
        { Icon: PiBookOpenTextLight, position: "lg:left-[300px] lg:top-1/3 md:left-[200px] md:top-1/3 left-[100px] top-1/3", animation: "animate-float-slow", color: "text-blue-500", size: "lg:w-16 lg:h-16 md:w-14 md:h-14 w-12 h-12" },
        { Icon: PiTranslateLight, position: "lg:left-10 lg:top-1/4 md:left-8 md:top-1/4 left-6 top-1/4", animation: "animate-float-delay-2", color: "text-purple-500", size: "lg:w-12 lg:h-12 md:w-10 md:h-10 w-8 h-8" },
        { Icon: PiChatCircleTextLight, position: "lg:left-[150px] lg:bottom-1/3 md:left-[100px] md:bottom-1/3 left-[50px] bottom-1/3", animation: "animate-float-delay-3", color: "text-pink-500", size: "lg:w-14 lg:h-14 md:w-12 md:h-12 w-10 h-10" },
        { Icon: PiNotebookLight, position: "lg:left-12 lg:bottom-16 md:left-10 md:bottom-14 left-8 bottom-12", animation: "animate-float-delay-1", color: "text-indigo-500", size: "lg:w-10 lg:h-10 md:w-8 md:h-8 w-6 h-6" },

        // Right side icons - Large screens (lg)
        { Icon: PiGlobeLight, position: "lg:right-[250px] lg:top-1/3 md:right-[150px] md:top-1/3 right-[100px] top-1/3", animation: "animate-float-delay-2", color: "text-green-500", size: "lg:w-16 lg:h-16 md:w-14 md:h-14 w-12 h-12" },
        { Icon: PiMicrophoneStageLight, position: "lg:right-10 lg:top-1/4 md:right-8 md:top-1/4 right-6 top-1/4", animation: "animate-float-slow", color: "text-yellow-500", size: "lg:w-12 lg:h-12 md:w-10 md:h-10 w-8 h-8" },
        { Icon: PiHeadphonesLight, position: "lg:right-6 lg:bottom-1/4 md:right-4 md:bottom-1/4 right-2 bottom-1/4", animation: "animate-float-delay-4", color: "text-red-500", size: "lg:w-14 lg:h-14 md:w-12 md:h-12 w-10 h-10" },
        { Icon: PiVideoLight, position: "lg:right-[220px] lg:bottom-16 md:right-[150px] md:bottom-14 right-[100px] bottom-12", animation: "animate-float-delay-1", color: "text-cyan-500", size: "lg:w-10 lg:h-10 md:w-8 md:h-8 w-6 h-6" },

        // Top icons - Large screens (lg)
        { Icon: PiUsersThreeLight, position: "lg:top-8 lg:left-1/4 md:top-6 md:left-1/4 top-4 left-1/4", animation: "animate-float-delay-3", color: "text-orange-500", size: "lg:w-12 lg:h-12 md:w-10 md:h-10 w-8 h-8" },
        { Icon: PiGraduationCapLight, position: "lg:top-16 lg:right-1/4 md:top-14 md:right-1/4 top-12 right-1/4", animation: "animate-float-delay-2", color: "text-teal-500", size: "lg:w-14 lg:h-14 md:w-12 md:h-12 w-10 h-10" },

        // Bottom icons - Large screens (lg)
        { Icon: PiGameControllerLight, position: "lg:bottom-[100px] lg:left-1/4 md:bottom-[80px] md:left-1/4 bottom-[60px] left-1/4", animation: "animate-float-delay-1", color: "text-violet-500", size: "lg:w-12 lg:h-12 md:w-10 md:h-10 w-8 h-8" },
        { Icon: PiChatsLight, position: "lg:bottom-[200px] lg:right-1/4 md:bottom-[150px] md:right-1/4 bottom-[100px] right-1/4", animation: "animate-float-delay-4", color: "text-rose-500", size: "lg:w-14 lg:h-14 md:w-12 md:h-12 w-10 h-10" },
    ];

    return (
        <div className='relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden'>
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient circles */}
                <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 blur-3xl"></div>
                <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-100/40 to-pink-100/40 blur-3xl"></div>

                {/* Floating Icons with gradients behind them */}
                {floatingIcons.map(({ Icon, position, animation, color, size }, index) => (
                    <div key={index} className={`absolute ${position} pointer-events-none`}>
                        <div className={`relative ${animation}`}>
                            {/* Gradient background for icon */}
                            <div className={`absolute inset-0 ${size} bg-white rounded-full blur-sm opacity-60`}></div>
                            {/* Icon */}
                            <Icon className={`${size} ${color} relative z-10 opacity-80`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className='w-full max-w-md relative z-10'>
                {/* Card Container */}
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden'>
                    {/* Logo Section */}
                    <div className="relative h-28 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/patterns/pattern-1.svg')] opacity-30"></div>
                        <img
                            src={logo}
                            className="h-20 w-auto relative z-10 bg-white p-2 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                            alt="Lingua Connect"
                        />
                    </div>

                    {/* Form Section */}
                    <div className="p-6">
                        <h2 className='text-xl font-bold text-center mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500'>
                            Welcome to Lingua Connect!
                        </h2>
                        <p className="text-gray-500 text-sm text-center mb-4">Connect, Learn, and Grow Together</p>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-1">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Email or Username"
                                        className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10 h-10 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-purple-600 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-0"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Sign in</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="my-4 flex items-center">
                            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="px-4 text-gray-500 text-xs">OR</span>
                            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="space-y-2">
                            <a
                                href={googleUrl}
                                className="flex items-center justify-center gap-2 w-full h-10 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-purple-200 transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-0"
                            >
                                <FcGoogle className="text-lg" />
                                <span className="text-sm">Continue with Google</span>
                            </a>
                            <Link
                                to="/register"
                                className="flex items-center justify-center gap-2 w-full h-10 bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-xl text-gray-700 font-medium hover:from-blue-100 hover:to-purple-100 transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-0"
                            >
                                <FaRegUserCircle className="text-lg text-purple-500" />
                                <span className="text-sm">Create new account</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
