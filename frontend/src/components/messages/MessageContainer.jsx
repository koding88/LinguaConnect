import React, { useEffect } from 'react'
import useConversationZ from '@/zustand/useConversationZ'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useSocketContext } from '@/context/SocketContext'

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversationZ();
    const { onlineUsers } = useSocketContext()
    const isOnline = onlineUsers?.includes(selectedConversation?._id)

    useEffect(() => {
        // cleanup function(when component unmounts)
        return () => {
            setSelectedConversation(null)
        }
    }, [])

    return <>
        {!selectedConversation ? <NoChatSelected /> : (
            <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                    <div className="relative">
                        <img src={selectedConversation.avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full mr-3" />
                        {isOnline && (
                            <div className="absolute top-0 right-[8px] w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <h2 className="text-xl font-semibold">{selectedConversation.full_name || selectedConversation.username}</h2>
                </div>

                {/* Messages */}
                <MessageList />

                {/* Message Input */}
                <MessageInput />
            </>
        )}
    </>
}

export default MessageContainer

const NoChatSelected = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Hello 👋 Koding 88 ❤️</h2>
            <p className="text-gray-500 text-center">Select a conversation to start messaging.</p>
        </div>
    );
}
