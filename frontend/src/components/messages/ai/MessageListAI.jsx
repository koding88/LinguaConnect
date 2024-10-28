import React, { useEffect, useRef } from 'react'
import MessageItemAI from './MessageItemAI'
import useConversationZ from "@/zustand/useConversationZ";

const MessageListAI = () => {
    const lastMessageRef = useRef();
    const { aiMessages } = useConversationZ();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [aiMessages]);

    return (
        <div className="flex-grow overflow-y-auto p-4">
            <MessageItemAI
                message="Hello! I'm your chatbot for improving English. Double-click the message to see 3 options: translation, grammar check, and writing tips."
                isAI={true}
            />
            {Array.isArray(aiMessages) && aiMessages.map((msg, index) => (
                <MessageItemAI
                    key={index}
                    message={msg.text}
                    isAI={msg.isAI}
                />
            ))}
            <div ref={lastMessageRef}></div>
        </div>
    );
};

export default MessageListAI;
