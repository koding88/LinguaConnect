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
        <div className="flex flex-col gap-4 p-4 border-b border-gray-100 sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 z-10">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Chats
            </h2>
            {/* Search bar */}
            <Search onSearch={onSearch} placeholder="Search messages" buttonText="Search" otherStyles="mx-0" />
        </div>

        <div className="divide-y divide-gray-100">
            <Conversations />
        </div>
    </>
}

export default SideBar
