import React from 'react';

const NoChatSelected = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Hello 👋 Koding 88 ❤️</h2>
            <p className="text-gray-500 text-center">Select a conversation to start messaging.</p>
        </div>
    );
};

export default NoChatSelected;
