import React, { useState, useCallback, useRef, useEffect } from 'react'
import { IoSend } from 'react-icons/io5'
import useSendMessage from '@/hooks/useSendMessage'
import { cn } from '@/lib/utils'
import useConversationZ from '@/zustand/useConversationZ'

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const { sendMessage, loading } = useSendMessage()
    const textareaRef = useRef(null);
    const { selectedConversation } = useConversationZ();

    // Reset input when conversation changes
    useEffect(() => {
        setMessage('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '45px';
        }
    }, [selectedConversation?._id]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            await sendMessage(message);
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = '45px';
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [message, sendMessage]);

    const handleTextareaChange = useCallback((e) => {
        const textarea = e.target;
        setMessage(textarea.value);

        // Reset height to default if empty
        if (!textarea.value.trim()) {
            textarea.style.height = '45px';
            return;
        }

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = '45px';

        // Set new height based on content
        const newHeight = Math.max(45, Math.min(textarea.scrollHeight, 250));
        textarea.style.height = `${newHeight}px`;
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex-grow relative">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            placeholder="Type a message..."
                            className={cn(
                                "w-full p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200",
                                "placeholder:text-gray-400 text-gray-600",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                "resize-none overflow-hidden shadow-sm",
                                "transition-all duration-200"
                            )}
                            style={{ height: '45px' }}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className={cn(
                            "h-[45px] w-[45px] rounded-xl flex items-center justify-center",
                            "bg-gradient-to-r from-blue-600 to-purple-600",
                            "text-white shadow-md hover:shadow-lg",
                            "transition-all duration-200 hover:scale-105",
                            loading || !message.trim()
                                ? "opacity-50 cursor-not-allowed grayscale"
                                : "hover:opacity-90"
                        )}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <IoSend className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MessageInput
