import React, { useEffect, useRef } from 'react'
import useGetMessages from '@/hooks/useGetMessages'
import MessageItem from './MessageItem'

const MessageList = () => {
    const { messages, loading } = useGetMessages()
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return <>
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {!loading &&
                messages.length > 0 &&
                messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef}>
                        <MessageItem message={message} />
                    </div>
                ))}

            {loading && (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
            {!loading && messages.length === 0 && (
                <p className='text-center'>Send a message to start the conversation</p>
            )}
        </div>
    </>
}

export default MessageList
