import { useState } from 'react';
import useConversationZ from "@/zustand/useConversationZ";
import { useAuthContext } from '@/context/AuthContext';

const useWritingTips = () => {
    const [loading, setLoading] = useState(false);
    const { setAIMessages } = useConversationZ();
    const { authUser } = useAuthContext();

    const getWritingTips = async (text, recipientId) => {
        setLoading(true);
        // Add a simulated user message
        setAIMessages({ text: `Get writing tips: "${text}"`, isAI: false });

        try {
            const response = await fetch('http://localhost:5555/api/v1/writing_tips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender_id: authUser._id,
                    recipient_id: recipientId,
                    content: text
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setAIMessages({ text: data.message, isAI: true });
            } else {
                throw new Error(data.error || 'Error getting writing tips');
            }
        } catch (error) {
            console.error('Error getting writing tips:', error);
            setAIMessages({ text: "Sorry, there was an error getting writing tips.", isAI: true });
        } finally {
            setLoading(false);
        }
    };

    return { getWritingTips, loading };
};

export default useWritingTips;
