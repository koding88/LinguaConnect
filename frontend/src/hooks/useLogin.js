import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { jwtDecode } from "jwt-decode";
import axiosClient from '@/api/axiosClient';

const useLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (identifier, password, otp = "XXXXXX") => {
        const success = handleInputErrors(identifier, password);
        if (!success) return;

        setLoading(true);
        try {
            const response = await axiosClient.post('/auth/login', { identifier, password, otp });
            const { data } = response;
            const { accessToken, refreshToken } = data.data;
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            // Decode the access token and set the auth user
            const decodedToken = jwtDecode(accessToken);
            localStorage.setItem("user", JSON.stringify(decodedToken));
            setAuthUser(decodedToken);

            toast.success(data.message);
            navigate('/');
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message === "Invalid OTP format") {
                navigate('/login/2fa', { state: { identifier, password } });
            } else {
                toast.info("ooo")
                toast.error(error.response?.data?.message)
                // toast.error(error.response?.data?.message || "An error occurred during login");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleRedirect = () => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            const decodedToken = jwtDecode(accessToken);
            localStorage.setItem("user", JSON.stringify(decodedToken));
            setAuthUser(decodedToken);

            toast.success("Successfully logged in with Google");
            navigate('/');
        } else {
            toast.error("Login failed");
            navigate('/login');
        }
    }

    return { login, loading, handleGoogleRedirect };
}

export default useLogin

function handleInputErrors(identifier, password) {
    if (!identifier || !password) {
        toast.error("Please fill in all fields");
        return false;
    }

    // Check if identifier is an email or username
    const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(identifier);
    const isUsername = /^[a-zA-Z0-9_]{3,50}$/.test(identifier);

    if (!isEmail && !isUsername) {
        toast.error("Enter a valid email address or username.");
        return false;
    }

    if (!password.trim()) {
        toast.error("Password is required.");
        return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
    if (!passwordRegex.test(password)) {
        toast.error("Password must be at least 8 characters and include a mix of letters and numbers.");
        return false;
    }

    return true;
}
