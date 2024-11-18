import React from 'react';
import { Video, Phone } from 'lucide-react';

const ChatHeader = ({ selectedConversation, isOnline, onStartCall }) => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="p-4 flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input type="hidden" name="conversationId" value={selectedConversation.userId} />
                        <img
                            src={selectedConversation.avatarUrl}
                            alt="User avatar"
                            className="w-12 h-12 rounded-full border-2 border-white shadow-md transition-transform hover:scale-105"
                        />
                        {isOnline && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            {selectedConversation.full_name || selectedConversation.username}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>

                {/* Call Actions */}
                <div className="flex items-center gap-2">
                    {/* Voice Call Button */}
                    <button
                        onClick={() => onStartCall(false)}
                        className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-gray-200 shadow-sm
                                 transition-all duration-200 hover:scale-105 hover:shadow-md group"
                    >
                        <Phone className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </button>

                    {/* Video Call Button */}
                    <button
                        onClick={() => onStartCall(true)}
                        className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-gray-200 shadow-sm
                                 transition-all duration-200 hover:scale-105 hover:shadow-md group"
                    >
                        <Video className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
