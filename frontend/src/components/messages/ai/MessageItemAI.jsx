import React from 'react'
import { BsRobot } from "react-icons/bs";
import { useAuthContext } from '@/context/AuthContext'

const MessageItemAI = ({ message, isAI }) => {
    const { authUser } = useAuthContext()

    const chatClassName = isAI ? 'chat-start' : 'chat-end'
    const avatarContent = isAI ? (
        <BsRobot className="w-full h-full text-blue-500" />
    ) : (
        <img src={authUser.avatarUrl} alt="User avatar" className="w-full h-full rounded-full" />
    )
    const bubbleBgColor = isAI ? "bg-gray-200" : "bg-blue-200"

    return (
        <div className={`chat ${chatClassName} mb-4`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    {avatarContent}
                </div>
            </div>
            <div className={`chat-bubble ${bubbleBgColor} text-black break-words max-w-[80%] overflow-hidden`}>
                <div dangerouslySetInnerHTML={{ __html: message }} />
            </div>
        </div>
    )
}

export default MessageItemAI
