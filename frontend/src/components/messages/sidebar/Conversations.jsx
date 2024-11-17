import Conversation from './Conversation'
import useGetConversations from '@/hooks/useGetConversations'
import { useSocketContext } from '@/context/SocketContext'

const Conversations = () => {
    const { loading, conversations } = useGetConversations();
    const { onlineUsers } = useSocketContext();

    // Sort conversations by online status and last message timestamp
    const sortedConversations = conversations?.sort((a, b) => {
        const isAOnline = onlineUsers?.includes(a._id);
        const isBOnline = onlineUsers?.includes(b._id);
        
        if (isAOnline && !isBOnline) return -1;
        if (!isAOnline && isBOnline) return 1;
        
        // If online status is the same, sort by last message timestamp
        const aTimestamp = new Date(a.lastMessage?.createdAt || 0).getTime();
        const bTimestamp = new Date(b.lastMessage?.createdAt || 0).getTime();
        return bTimestamp - aTimestamp;
    });

    return <>
        {sortedConversations?.map((conversation, idx) => (
            <Conversation
                key={conversation._id}
                conversation={conversation}
                lastIdx={idx === sortedConversations.length - 1}
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
