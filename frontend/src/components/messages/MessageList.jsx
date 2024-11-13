import React, { useEffect, useRef } from 'react'
import useGetMessages from '@/hooks/useGetMessages'
import MessageItem from './MessageItem'
import useListenMessages from '@/hooks/useListenMessages'

const MessageList = () => {
    const { messages, loading } = useGetMessages()
    useListenMessages()
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50/50 to-white/50">
            {!loading && messages.length > 0 && (
                <div className="space-y-6">
                    {messages.map((message) => (
                        <div key={message._id} ref={lastMessageRef}>
                            <MessageItem message={message} />
                        </div>
                    ))}
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 animate-pulse">Loading messages...</p>
                </div>
            )}

            {!loading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="p-4 bg-blue-50 rounded-full">
                        <svg
                            className="w-12 h-12 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Start Your Conversation
                    </p>
                    <p className="text-gray-500 text-center max-w-sm">
                        Send a message to begin chatting with your language partner
                    </p>
                </div>
            )}
        </div>
    )
}

export default MessageList
