import React from 'react';

const DebugInfo = ({ localStream, isMuted, isVideoEnabled }) => {
    return (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <p>Local Stream: {localStream ? 'Active' : 'Inactive'}</p>
            <p>Video Tracks: {localStream?.getVideoTracks().length || 0}</p>
            <p>Audio Tracks: {localStream?.getAudioTracks().length || 0}</p>
            <p>Video Enabled: {isVideoEnabled.toString()}</p>
            <p>Audio Enabled: {(!isMuted).toString()}</p>
        </div>
    );
};

export default DebugInfo;
