import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { IoPhonePortraitOutline } from "react-icons/io5";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import useLogin from '@/hooks/useLogin';
import { Shield, ShieldCheck, Loader2, Smartphone, QrCode, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login2FA = () => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = React.useState("")
    const { login } = useLogin();
    const location = useLocation();
    const navigate = useNavigate();

    const { identifier, password } = location.state || {};

    if (!identifier || !password) {
        navigate('/login');
        return null;
    }

    const handleSubmit = async () => {
        setLoading(true);
        await login(identifier, password, value);
        setLoading(false);
    }

    // Floating security icons
    const securityIcons = [
        { Icon: Shield, position: "top-10 left-10", animation: "animate-float-slow", color: "text-blue-500" },
        { Icon: Lock, position: "top-20 right-20", animation: "animate-float-delay-2", color: "text-purple-500" },
        { Icon: QrCode, position: "bottom-20 left-20", animation: "animate-float-delay-3", color: "text-pink-500" },
        { Icon: Smartphone, position: "bottom-10 right-10", animation: "animate-float-delay-1", color: "text-indigo-500" },
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden'>
            {/* Decorative Background */}
            <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 blur-3xl"></div>
                <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-100/40 to-pink-100/40 blur-3xl"></div>

                {/* Floating Icons */}
                {securityIcons.map(({ Icon, position, animation, color }, index) => (
                    <div key={index} className={`absolute ${position} pointer-events-none`}>
                        <div className={`relative ${animation}`}>
                            <div className="absolute inset-0 w-12 h-12 bg-white rounded-full blur-sm opacity-60"></div>
                            <Icon className={`w-12 h-12 ${color} relative z-10 opacity-80`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className='w-full max-w-md relative z-10'>
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden'>
                    {/* Header Section */}
                    <div className="relative h-28 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/patterns/pattern-1.svg')] opacity-30"></div>
                        <img
                            src={logo}
                            className="h-20 w-auto relative z-10 bg-white p-2 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                            alt="Lingua Connect"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <h2 className='text-xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500'>
                            Two Factor Authentication
                        </h2>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            Please enter the 6-digit code from your authenticator app
                        </p>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
                            <div className="flex justify-center mb-6">
                                <ShieldCheck className="w-12 h-12 text-blue-600" />
                            </div>

                            {/* Centered OTP Input */}
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={value}
                                    onChange={setValue}
                                    className="gap-3"
                                    containerClassName="flex justify-center"
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot
                                            index={0}
                                            className="rounded-lg border-gray-200 w-12 h-12 text-lg font-semibold text-center"
                                        />
                                        <InputOTPSlot
                                            index={1}
                                            className="rounded-lg border-gray-200 w-12 h-12 text-lg font-semibold text-center"
                                        />
                                        <InputOTPSlot
                                            index={2}
                                            className="rounded-lg border-gray-200 w-12 h-12 text-lg font-semibold text-center"
                                        />
                                    </InputOTPGroup>
                                    <InputOTPSeparator className="mx-2">-</InputOTPSeparator>
                                    <InputOTPGroup>
                                        <InputOTPSlot
                                            index={3}
                                            className="rounded-lg border-gray-200 w-12 h-12 text-lg font-semibold text-center"
                                        />
                                        <InputOTPSlot
                                            index={4}
                                            className="rounded-lg border-gray-200 w-12 h-12 text-lg font-semibold text-center"
                                        />
                                        <InputOTPSlot
                                            index={5}
                                            className="rounded-lg border-gray-200 w-12 h-12 text-lg font-semibold text-center"
                                        />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <ShieldCheck className="h-5 w-5" />
                                    <span>Verify Code</span>
                                </div>
                            )}
                        </Button>

                        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
                                <Smartphone className="w-4 h-4 text-blue-500" />
                                Open your authenticator app to view your code
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login2FA;
