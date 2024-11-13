import React from 'react';

const NoChatSelected = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50/50 to-white/50">
            <div className="text-center space-y-6 max-w-md px-4">
                {/* Icon Container */}
                <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Welcome to Lingua Connect
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        Select a conversation from the sidebar to start chatting with your language partners.
                        Practice your language skills and make new friends!
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4 text-sm mt-8">
                    <div className="p-4 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-blue-500 mb-2">✨ Real-time Chat</div>
                        <p className="text-gray-600">Connect instantly with native speakers</p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-purple-500 mb-2">🤖 AI Assistant</div>
                        <p className="text-gray-600">Get help with translations and grammar</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoChatSelected;
