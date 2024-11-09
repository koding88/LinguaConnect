import React from 'react';
import { Video, Phone } from 'lucide-react';

const ChatHeader = ({ selectedConversation, isOnline, onStartCall }) => {
    return (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
                <div className="relative">
                    <img
                        src={selectedConversation.avatarUrl}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    {isOnline && (
                        <div className="absolute top-0 right-[8px] w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <h2 className="text-xl font-semibold">
                    {selectedConversation.full_name || selectedConversation.username}
                </h2>
            </div>

            {/* Action Call */}
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Phone
                        onClick={() => onStartCall(false)}
                        className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors"
                    />
                </div>
                <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Video
                        onClick={() => onStartCall(true)}
                        className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
