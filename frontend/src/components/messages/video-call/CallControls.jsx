import React from 'react';
import { Video, Phone, VideoOff, Mic, MicOff } from 'lucide-react';

const CallControls = ({ isMuted, isVideoEnabled, toggleMic, toggleVideo, handleEndVideoCall }) => {
    return (
        <div className="flex items-center justify-center gap-6 mt-8">
            <button
                className="p-5 bg-gray-500 hover:bg-gray-600 rounded-full transition-colors duration-200"
                onClick={toggleMic}
            >
                {isMuted ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
            </button>
            <button
                className="p-5 bg-gray-500 hover:bg-gray-600 rounded-full transition-colors duration-200"
                onClick={toggleVideo}
            >
                {isVideoEnabled ? <Video className="w-8 h-8 text-white" /> : <VideoOff className="w-8 h-8 text-white" />}
            </button>
            <button
                className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
                onClick={handleEndVideoCall}
            >
                <Phone className="w-8 h-8 text-white rotate-135" />
            </button>
        </div>
    );
};

export default CallControls;
