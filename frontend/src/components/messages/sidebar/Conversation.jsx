import useConversationZ from '@/zustand/useConversationZ'
import { useSocketContext } from '@/context/SocketContext'

const Conversation = ({ conversation }) => {
    const { selectedConversation, setSelectedConversation } = useConversationZ()
    const isSelected = selectedConversation?._id === conversation._id
    const { onlineUsers } = useSocketContext()
    const isUserOnline = onlineUsers?.includes(conversation._id)

    return <>
        <div
            className={`flex gap-3 items-center p-3 cursor-pointer transition-all duration-200
                ${isSelected 
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm" 
                    : "hover:bg-gray-50"
                }
                rounded-lg mx-2 my-1
            `}
            onClick={() => setSelectedConversation(conversation)}
        >
            <div className='relative'>
                <img
                    src={conversation.avatarUrl}
                    alt={`User avatar`}
                    className={`w-12 h-12 rounded-full border-2 transition-transform duration-200
                        ${isSelected 
                            ? "border-blue-200 shadow-md scale-105" 
                            : "border-white hover:scale-105"
                        }
                    `}
                />
                {isUserOnline && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                )}
            </div>
            <div className="flex-grow">
                <h3 className={`font-semibold transition-colors duration-200
                    ${isSelected 
                        ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" 
                        : "text-gray-800"
                    }
                `}>
                    {conversation.full_name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{conversation.username}</p>
            </div>
        </div>
    </>
}

export default Conversation
