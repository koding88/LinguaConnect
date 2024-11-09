import React from 'react'
import useConversationZ from '@/zustand/useConversationZ'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useSocketContext } from '@/context/SocketContext'
import ChatHeader from '@/components/messages/header/ChatHeader'
import NoChatSelected from './NoChatSelected'
import { useStringeeContext } from '@/context/StringeeContext'

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversationZ();
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers?.includes(selectedConversation?._id);
    const { handleStartCall } = useStringeeContext();

    React.useEffect(() => {
        return () => {
            setSelectedConversation(null);
        };
    }, []);

    if (!selectedConversation) return <NoChatSelected />;

    return (
        <>
            <ChatHeader
                selectedConversation={selectedConversation}
                isOnline={isOnline}
                onStartCall={(isVideo) => handleStartCall(isVideo, selectedConversation)}
            />
            <MessageList />
            <MessageInput />
        </>
    )
};

export default MessageContainer;
