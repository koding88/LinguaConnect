import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import TopicsSection from '../TopicsSection';
import VideoStream from './VideoStream';
import CallControls from './CallControls';
import DebugInfo from './DebugInfo';

const VideoCallDialog = ({
    isVideoCall,
    selectedConversation,
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    toggleMic,
    toggleVideo,
    handleEndVideoCall,
    markdown
}) => {
    console.log("Local stream in VideoCallDialog:", localStream);
    console.log("Remote stream in VideoCallDialog:", remoteStream);

    return (
        <AlertDialog open={isVideoCall}>
            <AlertDialogContent className="flex flex-col items-center p-8 max-w-6xl mx-auto rounded-2xl">
                <AlertDialogHeader className="text-center w-full mb-6">
                    <AlertDialogTitle className="text-3xl font-semibold">
                        Video Call with {selectedConversation.full_name || selectedConversation.username}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="flex gap-4 w-full">
                    <VideoStream
                        id="localVideo"
                        stream={localStream}
                        isMuted={true}
                        label="You"
                    />
                    <VideoStream
                        id="remoteVideo"
                        stream={remoteStream}
                        isMuted={false}
                        label={selectedConversation.full_name || selectedConversation.username}
                    />
                    <TopicsSection markdown={markdown} />
                </div>

                <CallControls
                    isMuted={isMuted}
                    isVideoEnabled={isVideoEnabled}
                    toggleMic={toggleMic}
                    toggleVideo={toggleVideo}
                    handleEndVideoCall={handleEndVideoCall}
                />

                <DebugInfo
                    localStream={localStream}
                    remoteStream={remoteStream}
                    isMuted={isMuted}
                    isVideoEnabled={isVideoEnabled}
                />
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default VideoCallDialog;
