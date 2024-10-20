import { useState, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import useConversationZ from "@/zustand/useConversationZ";
import { toast } from 'react-toastify';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversationZ();

    const sendMessage = useCallback(async (message) => {
        if (!selectedConversation?._id) {
            toast.error("No conversation selected");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post(`/messages/send/${selectedConversation._id}`, { message });

            if (response.data.status === "error") {
                throw new Error(response.data.message);
            }

            if (response.data.status === "success") {
                setMessages([...messages, response.data.data]);
            }
        } catch (error) {
            toast.error(error.message || "Failed to send message");
            throw error; // Re-throw the error for the caller to handle if needed
        } finally {
            setLoading(false);
        }
    }, [selectedConversation, setMessages, messages]);

    return { sendMessage, loading };
};

export default useSendMessage;
