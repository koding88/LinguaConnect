import { useState } from 'react'
import axiosClient from '@/api/axiosClient';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const useSignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const signUp = async (userData) => {
        const success = handleInputErrors(userData);
        if (!success) return;

        setLoading(true);
        try {
            const response = await axiosClient.post('/auth/register', userData);
            const data = response.data;
            toast.success(data.message);
            toast.info("Please check your email for verification");
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
            throw new Error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return { signUp, loading };
}

export default useSignUp

function handleInputErrors(userData) {
    const { full_name, username, email, password, birthday, location } = userData;

    if (!full_name || !username || !email || !password || !birthday || !location) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    // Initial validation and utility functions
    if (!full_name.trim()) {
        toast.error("Full name is required.");
        return false;
    }
    if (full_name.length < 5 || full_name.length > 50) {
        toast.error("Full name must be between 5 and 50 characters.");
        return false;
    }

    if (!username.trim()) {
        toast.error("Username is required.");
        return false;
    }
    if (username.length < 3 || username.length > 50) {
        toast.error("Username must be between 3 and 50 characters.");
        return false;
    }

    if (!email.trim()) {
        toast.error("Email is required.");
        return false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        toast.error("Enter a valid email address.");
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

    if (!birthday) {
        toast.error("Birthday is required.");
        return false;
    }
    const [day, month, year] = birthday.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    if (age < 13 || (age === 13 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
        toast.error("User must be at least 13 years old.");
        return false;
    }

    if (!location) {
        toast.error("Location is required.");
        return false;
    }

    return true;
}
