import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useConversationZ from "@/zustand/useConversationZ";
import axiosClient from "@/api/axiosClient";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversationZ();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/messages/${selectedConversation._id}`);
                const data = response.data.data
                if (response.data.status === "error") {
                    throw new Error(response.data.message);
                }
                setMessages(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessages]);

    return { messages, loading };
}

export default useGetMessages
