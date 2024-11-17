import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const { authUser } = useAuthContext();
    const location = useLocation();

    useEffect(() => {
        if (!authUser) {
            navigate('/login', { replace: true });
        } else if (authUser.role === 'admin' && !location.pathname.startsWith('/admin')) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [authUser, navigate, location]);

    if (!authUser) {
        return null;
    }

    return children;
};

export default AuthGuard;
