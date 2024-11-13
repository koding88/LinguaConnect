import React from 'react';
import { Video, Phone, VideoOff, Mic, MicOff } from 'lucide-react';

const CallControls = ({ isMuted, isVideoEnabled, toggleMic, toggleVideo, handleEndVideoCall }) => {
    return (
        <div className="flex items-center justify-center gap-6">
            <button
                onClick={toggleMic}
                className={`p-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg
                    ${isMuted
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
            >
                {isMuted ? (
                    <MicOff className="w-6 h-6 text-white" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}
            </button>

            <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg
                    ${!isVideoEnabled
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
            >
                {isVideoEnabled ? (
                    <Video className="w-6 h-6 text-white" />
                ) : (
                    <VideoOff className="w-6 h-6 text-white" />
                )}
            </button>

            <button
                onClick={handleEndVideoCall}
                className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full
                         transition-all duration-200 hover:scale-105 shadow-lg"
            >
                <Phone className="w-6 h-6 text-white rotate-135" />
            </button>
        </div>
    );
};

export default CallControls;
