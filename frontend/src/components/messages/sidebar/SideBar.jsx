import React from 'react'
import Search from '@/components/search/Search'
import Conversations from './Conversations'
import useConversationZ from '@/zustand/useConversationZ'
import useGetConversations from '@/hooks/useGetConversations'
import { toast } from 'react-toastify'

const SideBar = () => {
    const { setSelectedConversation } = useConversationZ();
    const { conversations } = useGetConversations();

    const onSearch = (searchTerm) => {
        const filteredConversations = conversations.find((c) => c.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filteredConversations) {
            setSelectedConversation(filteredConversations);
        } else {
            toast.error("No conversation found");
        }
    }

    return <>
        <div className="flex flex-col gap-4 p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold">Chats</h2>
            {/* Search bar */}
            <Search onSearch={onSearch} placeholder="Search messages" buttonText="Search" otherStyles="mx-0" />
        </div>

        <div className="divide-y divide-gray-200">
            {/* Repeat this block for each conversation */}
            <Conversations />
        </div>
    </>
}

export default SideBar
