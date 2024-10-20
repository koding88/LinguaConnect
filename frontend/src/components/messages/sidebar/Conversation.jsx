import React from 'react'
import useConversationZ from '@/zustand/useConversationZ'

const Conversation = ({ conversation, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversationZ()
    const isSelected = selectedConversation?._id === conversation._id

    return <>
        <div className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-gray-100' : ''}`}
            onClick={() => setSelectedConversation(conversation)}
        >
            <img src={conversation.avatarUrl} alt={`User avatar`} className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
                <h3 className="font-semibold">{conversation.full_name}</h3>
                <p className="text-sm text-gray-500 truncate">{conversation.username}</p>
            </div>
        </div>
    </>
}

export default Conversation
