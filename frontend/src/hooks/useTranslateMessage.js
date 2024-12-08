import { useState } from 'react';
import useConversationZ from "@/zustand/useConversationZ";
import { useAuthContext } from '@/context/AuthContext';

const useTranslateMessage = () => {
    const [loading, setLoading] = useState(false);
    const { setAIMessages } = useConversationZ();
    const { authUser } = useAuthContext();

    const translateMessage = async (text, recipientId, language) => {
        setLoading(true);
        // Add a simulated user message
        setAIMessages({ text: `Translate: "${text}"`, isAI: false });

        try {
            const response = await fetch(`${import.meta.env.VITE_AI_URL}/api/v1/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: authUser._id,
                    recipient_id: recipientId,
                    content: text,
                    language: language
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setAIMessages({ text: data.message, isAI: true });
            } else {
                throw new Error(data.error || 'Error translating message');
            }
        } catch (error) {
            console.error('Error translating message:', error);
            setAIMessages({ text: "Sorry, there was an error translating the message.", isAI: true });
        } finally {
            setLoading(false);
        }
    };

    return { translateMessage, loading };
};

export default useTranslateMessage;
