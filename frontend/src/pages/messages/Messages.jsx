import React from 'react'
import SideBar from '@/components/messages/sidebar/SideBar'
import MessageContainer from '@/components/messages/MessageContainer'
import MessageListAI from '@/components/messages/ai/MessageListAI'
import { BsRobot } from "react-icons/bs";


const Messages = () => {
    return (
        <>
            <div className="flex h-screen">
                {/* Left column - Conversations list */}
                <div className="w-1.5/6 bg-white border-r border-gray-200 overflow-y-auto">
                    <SideBar />
                </div>

                {/* Middle column - Chat window */}
                <div className="w-3/6 bg-white flex flex-col">
                    <MessageContainer />
                </div>

                {/* Right column - User info */}
                <div className="w-2/6 bg-white border-l border-gray-200 flex flex-col">

                    {/* AI Chatbot */}

                    <div className="border-b border-gray-200 flex items-center justify-center p-4">
                        <BsRobot className="mr-2 text-blue-500 w-10 h-10" />
                        <h2 className="text-xl font-semibold">Lingua Connect AI</h2>
                    </div>

                    <MessageListAI />

                    {/* End */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed">
                            Coming soon!!!
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Messages
