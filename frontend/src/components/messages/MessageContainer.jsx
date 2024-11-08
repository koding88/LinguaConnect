import React, { useEffect } from 'react'
import useConversationZ from '@/zustand/useConversationZ'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useSocketContext } from '@/context/SocketContext'
import { Video, Phone } from 'lucide-react';
// AlertDialog
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Video Call Dialog
import VideoCallDialog from './video-call/VideoCallDialog'

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversationZ();
    const { onlineUsers } = useSocketContext()
    const isOnline = onlineUsers?.includes(selectedConversation?._id)

    useEffect(() => {
        // cleanup function(when component unmounts)
        return () => {
            setSelectedConversation(null)
        }
    }, [])

    const [isCalling, setIsCalling] = React.useState(false);
    const [isIncomingCall, setIsIncomingCall] = React.useState(false);
    const [isVideoCall, setIsVideoCall] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
    const [localStream, setLocalStream] = React.useState(null);
    const [remoteStream, setRemoteStream] = React.useState(null);

    const handleStartCall = () => {
        setIsCalling(true);
        setIsIncomingCall(false);
    }

    const handleAcceptCall = async () => {
        try {
            console.log('Requesting media permissions...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            console.log('Stream obtained:', stream);
            console.log('Video tracks:', stream.getVideoTracks());
            console.log('Audio tracks:', stream.getAudioTracks());

            setLocalStream(stream);
            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                console.log('Local video element found');
                localVideo.srcObject = stream;
                localVideo.onloadedmetadata = () => {
                    console.log('Local video metadata loaded');
                    localVideo.play()
                        .then(() => console.log('Local video playing'))
                        .catch(err => console.error("Error playing local video:", err));
                };
            } else {
                console.log('Local video element not found');
            }

            setIsCalling(false);
            setIsIncomingCall(false);
            setIsVideoCall(true);

            localStorage.setItem('mediaPermissionsGranted', 'true');
        } catch (err) {
            console.error('Detailed error accessing media devices:', err);
            alert(`Không thể truy cập camera hoặc microphone. Lỗi: ${err.message}`);
        }
    }

    const handleRejectCall = () => {
        setIsCalling(false);
        setIsIncomingCall(false);
    }

    const handleEndVideoCall = () => {
        // Stop all tracks in the streams
        if (localStream) {
            localStream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            const localVideo = document.getElementById('localVideo');
            if (localVideo) localVideo.srcObject = null;
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            const remoteVideo = document.getElementById('remoteVideo');
            if (remoteVideo) remoteVideo.srcObject = null;
        }
        setLocalStream(null);
        setRemoteStream(null);
        setIsVideoCall(false);
        setIsMuted(false);
        setIsVideoEnabled(true);
    }

    // Thêm các hàm xử lý riêng cho mic và video
    const toggleMic = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const markdown = `
    ### 🌅 Morning Routine Discussion

    **A**: Good morning! What time do you usually wake up? ⏰

    **B**: Hi! I&apos;m an early bird - I wake up at 6 AM every day. How about you? 🌄
    `

    return <>
        {!selectedConversation ? <NoChatSelected /> : (
            <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="relative">
                            <img src={selectedConversation.avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full mr-3" />
                            {isOnline && (
                                <div className="absolute top-0 right-[8px] w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold">{selectedConversation.full_name || selectedConversation.username}</h2>
                    </div>


                    {/* Action Call */}
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Phone className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Video onClick={() => handleStartCall(true)} className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
                        </div>
                    </div>

                    {/* AlertDialog for Call */}
                    <AlertDialog open={isCalling}>
                        <AlertDialogContent className="flex flex-col items-center p-8 max-w-sm mx-auto rounded-2xl">
                            <AlertDialogHeader className="text-center w-full">
                                <div className="relative mb-6">
                                    <img
                                        src={selectedConversation.avatarUrl}
                                        alt="Caller avatar"
                                        className="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto shadow-lg"
                                    />
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                                        Calling...
                                    </div>
                                </div>
                                <AlertDialogTitle className="text-2xl text-center font-semibold mb-3">
                                    {selectedConversation.full_name || selectedConversation.username}
                                </AlertDialogTitle>
                            </AlertDialogHeader>

                            <div className="flex items-center justify-center mt-8">
                                <button
                                    className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    onClick={() => setIsCalling(false)}
                                >
                                    <Phone className="w-7 h-7 text-white" />
                                </button>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* AlertDialog for Incoming Call */}
                    <AlertDialog open={isIncomingCall}>
                        <AlertDialogContent className="flex flex-col items-center p-8 max-w-sm mx-auto rounded-2xl">
                            <AlertDialogHeader className="text-center w-full">
                                <div className="relative mb-6">
                                    <img
                                        src={selectedConversation.avatarUrl}
                                        alt="Caller avatar"
                                        className="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto shadow-lg animate-pulse"
                                    />
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                                        Incoming Call...
                                    </div>
                                </div>
                                <AlertDialogTitle className="text-2xl text-center font-semibold mb-3">
                                    {selectedConversation.full_name || selectedConversation.username}
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button
                                    className="p-5 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    onClick={() => handleAcceptCall()}
                                >
                                    <Phone className="w-7 h-7 text-white" />
                                </button>
                                <button
                                    className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    onClick={() => handleRejectCall()}
                                >
                                    <Phone className="w-7 h-7 text-white rotate-135" />
                                </button>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Video Call Dialog */}
                    <VideoCallDialog
                        isVideoCall={isVideoCall}
                        selectedConversation={selectedConversation}
                        localStream={localStream}
                        remoteStream={remoteStream}
                        isMuted={isMuted}
                        isVideoEnabled={isVideoEnabled}
                        toggleMic={toggleMic}
                        toggleVideo={toggleVideo}
                        handleEndVideoCall={handleEndVideoCall}
                        markdown={markdown}
                    />
                </div>

                {/* Messages */}
                <MessageList />

                {/* Message Input */}
                <MessageInput />
            </>
        )}
    </>
}

export default MessageContainer

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
}
