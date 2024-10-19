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

const Login2FA = () => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = React.useState("")
    const { login } = useLogin();
    const location = useLocation();
    const navigate = useNavigate();

    const { identifier, password } = location.state || {};

    if (!identifier || !password) {
        // Redirect to login page if identifier or password is missing
        navigate('/login');
        return null;
    }

    const handleSubmit = async () => {
        setLoading(true);
        await login(identifier, password, value);
        setLoading(false);
    }

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='w-full max-w-md bg-white rounded-lg border-[1px] border-[#D5D5D5] p-6 sm:p-8'>
                <div className="flex justify-center mb-3">
                    <img src={logo} className="h-20 w-auto sm:h-24" alt="Lingua Connect" />
                </div>
                <h2 className='text-2xl font-bold text-center mb-3'>Two factor authentication</h2>
                <div className="flex justify-center mb-2">
                    <IoPhonePortraitOutline className="w-12 h-12" />
                </div>
                <div className="mb-4 flex flex-col items-center justify-center">
                    <label htmlFor="authCode" className="block text-sm text-center font-medium text-gray-700 mb-4">Authentication Code</label>
                    <InputOTP maxLength={6} value={value} onChange={setValue}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300" disabled={loading} onClick={handleSubmit}>
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Verifying...
                        </div>
                    ) : (
                        "Verify"
                    )}
                </button>
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Open your two-factor authenticator (TOTP) app or browser extension to view your authentication code.
                </p>
            </div>
        </div>
    );
}

export default Login2FA;
