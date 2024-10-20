import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axiosClient from '@/api/axiosClient';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get("/messages/conversations");
                const data = response.data.data;

                if (response.data.status === "error") {
                    toast.error(response.data.message);
                }
                setConversations(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations };
};
export default useGetConversations;
