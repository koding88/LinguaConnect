import React from 'react'
import { BsRobot } from "react-icons/bs";
import { useAuthContext } from '@/context/AuthContext'

const MessageItemAI = ({ message, isAI }) => {
    const { authUser } = useAuthContext()

    const chatClassName = isAI ? 'chat-start' : 'chat-end'
    const bubbleClassName = isAI
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'

    return (
        <div className={`chat ${chatClassName} mb-4`}>
            <div className="chat-image avatar">
                {isAI ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-2 shadow-md">
                        <BsRobot className="w-full h-full text-blue-600" />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-md">
                        <img
                            src={authUser.avatarUrl}
                            alt="User avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                )}
            </div>
            <div className={`chat-bubble ${bubbleClassName} shadow-md backdrop-blur-sm`}>
                <div
                    dangerouslySetInnerHTML={{ __html: message }}
                    className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2
                              prose-strong:text-inherit prose-em:text-inherit"
                />
            </div>
        </div>
    )
}

export default MessageItemAI
