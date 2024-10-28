import { useState } from 'react';
import useConversationZ from "@/zustand/useConversationZ";
import { useAuthContext } from '@/context/AuthContext';

const useCheckGrammar = () => {
    const [loading, setLoading] = useState(false);
    const { setAIMessages } = useConversationZ();
    const { authUser } = useAuthContext();

    const checkGrammar = async (text) => {
        setLoading(true);
        // Add a simulated user message
        setAIMessages({ text: `Check grammar: "${text}"`, isAI: false });

        try {
            const response = await fetch('http://localhost:5555/api/v1/check_grammar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: authUser.userId,
                    text: text
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setAIMessages({ text: data.message, isAI: true });
            } else {
                throw new Error(data.error || 'Error checking grammar');
            }
        } catch (error) {
            console.error('Error checking grammar:', error);
            setAIMessages({ text: "Sorry, there was an error checking the grammar.", isAI: true });
        } finally {
            setLoading(false);
        }
    };

    return { checkGrammar, loading };
};

export default useCheckGrammar;
