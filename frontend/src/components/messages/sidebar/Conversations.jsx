import React from 'react'
import Conversation from './Conversation'
import useGetConversations from '@/hooks/useGetConversations'

const Conversations = () => {
    const { loading, conversations } = useGetConversations();

    return <>
        {conversations?.map((conversation, idx) => (
            <Conversation
                key={conversation._id}
                conversation={conversation}
                lastIdx={idx === conversations?.length - 1}
            />
        ))}

        {loading ? (
            <div className="flex justify-center p-4">
                <span className='loading loading-spinner text-blue-600'></span>
            </div>
        ) : null}
    </>
}

export default Conversations
