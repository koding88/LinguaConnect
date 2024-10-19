import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (!authUser) {
            navigate('/login', { replace: true });
        }
    }, [authUser, navigate]);

    if (!authUser) {
        return null;
    }

    return children;
};

export default AuthGuard;
