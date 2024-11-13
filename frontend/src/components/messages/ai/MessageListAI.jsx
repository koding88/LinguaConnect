import React, { useEffect, useRef } from 'react'
import MessageItemAI from './MessageItemAI'
import useConversationZ from "@/zustand/useConversationZ";
import { BsChatDots } from "react-icons/bs";

const MessageListAI = () => {
    const lastMessageRef = useRef();
    const { aiMessages } = useConversationZ();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [aiMessages]);

    return (
        <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-br from-gray-50/50 to-white/50">
            {/* Welcome Message */}
            <MessageItemAI
                message={`
                    <div class="space-y-2">
                        <p>👋 Hello! I'm your AI language assistant.</p>
                        <p>I can help you with:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Translations</li>
                            <li>Grammar checks</li>
                            <li>Writing tips</li>
                        </ul>
                        <p><em>Double-click any message to see these options!</em></p>
                    </div>
                `}
                isAI={true}
            />

            {/* AI Messages */}
            {Array.isArray(aiMessages) && aiMessages.length > 0 ? (
                aiMessages.map((msg, index) => (
                    <MessageItemAI
                        key={index}
                        message={msg.text}
                        isAI={msg.isAI}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center mt-8 space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                        <BsChatDots className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-500 text-center max-w-sm">
                        Start chatting to see AI-powered suggestions and improvements
                    </p>
                </div>
            )}

            <div ref={lastMessageRef} />
        </div>
    );
};

export default MessageListAI;
