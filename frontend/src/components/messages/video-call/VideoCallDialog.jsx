import React from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import TopicsSection from '../TopicsSection';
import VideoStream from './VideoStream';
import CallControls from './CallControls';

const VideoCallDialog = ({
    isVideoCall,
    selectedConversation,
    callerInfo,
    authUser,
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    toggleMic,
    toggleVideo,
    handleEndVideoCall,
}) => {
    return (
        <AlertDialog open={isVideoCall}>
            <AlertDialogContent className="bg-white/95 backdrop-blur-sm p-6 max-w-6xl mx-auto rounded-2xl border border-gray-100">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Video Call with {selectedConversation?.full_name || selectedConversation?.username}
                        </h2>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <div className="flex flex-col gap-2 w-full lg:w-2/3">
                            {/* Video streams container */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="aspect-video sm:aspect-square md:aspect-video">
                                    <VideoStream
                                        id="localVideo"
                                        stream={localStream}
                                        isMuted={true}
                                        label="You"
                                        avatarUrl={authUser?.avatarUrl}

                                    />
                                </div>
                                <div className="aspect-video sm:aspect-square md:aspect-video">
                                    <VideoStream
                                        id="remoteVideo"
                                        stream={remoteStream}
                                        isMuted={false}
                                        label={callerInfo?.full_name || callerInfo?.username}
                                        avatarUrl={callerInfo?.avatarUrl}
                                    />
                                </div>
                            </div>
                        </div>
                        <TopicsSection authUser={authUser} />
                    </div>

                    {/* Controls */}
                    <div className="border-t border-gray-100">
                        <CallControls
                            isMuted={isMuted}
                            isVideoEnabled={isVideoEnabled}
                            toggleMic={toggleMic}
                            toggleVideo={toggleVideo}
                            handleEndVideoCall={handleEndVideoCall}
                        />
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default VideoCallDialog;
