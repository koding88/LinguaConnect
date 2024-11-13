import React from 'react'
import SideBar from '@/components/messages/sidebar/SideBar'
import MessageContainer from '@/components/messages/MessageContainer'
import MessageListAI from '@/components/messages/ai/MessageListAI'
import { BsRobot } from "react-icons/bs";

const Messages = () => {
    return (
        <div className="flex h-screen">
            {/* Left column - Conversations list */}
            <div className="w-1.5/6 bg-white border-r border-gray-100 shadow-sm overflow-y-auto">
                <SideBar />
            </div>

            {/* Middle column - Chat window */}
            <div className="w-3/6 bg-white flex flex-col">
                <MessageContainer />
            </div>

            {/* Right column - AI Assistant */}
            <div className="w-2/6 bg-white border-l border-gray-100 shadow-sm flex flex-col">
                {/* AI Chatbot Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 flex items-center justify-center p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/80 rounded-full shadow-sm">
                            <BsRobot className="text-blue-600 w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Lingua Connect AI
                        </h2>
                    </div>
                </div>

                <MessageListAI />

                {/* Coming soon section */}
                <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="w-full p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-500 cursor-not-allowed text-center font-medium">
                        Coming soon!!!
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages
