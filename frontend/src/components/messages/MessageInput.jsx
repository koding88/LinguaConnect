import React, { useState, useCallback } from 'react'
import { IoSend } from 'react-icons/io5'
import useSendMessage from '@/hooks/useSendMessage'
import { cn } from '@/lib/utils'

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const { sendMessage, loading } = useSendMessage()
    const textareaRef = React.useRef(null);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            await sendMessage(message);
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = '40px';
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [message, sendMessage]);

    const handleTextareaChange = useCallback((e) => {
        setMessage(e.target.value);
        e.target.style.height = '40px';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 250)}px`;
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex items-center">
                <textarea
                    ref={textareaRef}
                    value={message}
                    placeholder="Type a message..."
                    className={cn(
                        "flex-grow p-2 border border-gray-300 rounded-lg resize-none overflow-hidden",
                        "focus:outline-none focus:ring-2 focus:ring-black-500",
                        "transition-all duration-200 ease-in-out"
                    )}
                    style={{ minHeight: '40px', maxHeight: '250px', height: '40px' }}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className={cn(
                        "ml-4 text-black text-2xl px-4 border border-gray-300 rounded-lg",
                        "transition-all duration-200 ease-in-out",
                        "h-10", // Added fixed height of 40px
                        loading || !message.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                    )}
                >
                    {loading ? <div className='loading loading-spinner'></div> : <IoSend />}
                </button>
            </div>
        </form>
    )
}

export default React.memo(MessageInput)
