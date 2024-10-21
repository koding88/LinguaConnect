import React from 'react'
import useConversationZ from '@/zustand/useConversationZ'
import { useSocketContext } from '@/context/SocketContext'

const Conversation = ({ conversation, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversationZ()
    const isSelected = selectedConversation?._id === conversation._id
    const { onlineUsers } = useSocketContext()
    const isOnline = onlineUsers?.includes(conversation?._id)

    return <>
        <div className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-gray-100' : ''}`}
            onClick={() => setSelectedConversation(conversation)}
        >
            <div className='relative'>
                <img src={conversation.avatarUrl} alt={`User avatar`} className="w-10 h-10 rounded-full mr-3" />
                {isOnline && (
                    <div className="absolute top-0 right-[8px] w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
            </div>
            <div className="flex-grow">
                <h3 className="font-semibold">{conversation.full_name}</h3>
                <p className="text-sm text-gray-500 truncate">{conversation.username}</p>
            </div>
        </div>
    </>
}

export default Conversation
