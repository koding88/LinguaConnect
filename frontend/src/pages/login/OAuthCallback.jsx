import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogin from '@/hooks/useLogin';

const OAuthCallback = () => {
    const { handleGoogleRedirect } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        handleGoogleRedirect();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Processing login, please wait...</p>
        </div>
    );
};

export default OAuthCallback;
