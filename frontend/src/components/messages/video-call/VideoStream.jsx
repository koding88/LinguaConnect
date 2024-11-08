import React from 'react';

const VideoStream = ({ id, stream, isMuted, label }) => {
    return (
        <div className="relative w-1/3">
            <video
                key={id}
                id={id}
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-[400px] object-cover rounded-lg bg-gray-100"
                ref={(el) => {
                    if (el && stream) {
                        el.srcObject = stream;
                    }
                }}
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-base">
                {label}
            </div>
        </div>
    );
};

export default VideoStream;
