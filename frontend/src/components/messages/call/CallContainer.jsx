import React from 'react'
import { useStringeeContext } from '@/context/StringeeContext'
import { useAuthContext } from '@/context/AuthContext'
import CallDialogs from '@/components/messages/call/CallDialogs'
import VideoCallDialog from '@/components/messages/video-call/VideoCallDialog'

const CallContainer = () => {
    const {
        isCalling,
        isIncomingCall,
        isVideoCall,
        isMuted,
        isVideoEnabled,
        selectedConversation,
        localStream,
        remoteStream,
        callStatus,
        callerInfo,
        handleAcceptCall,
        handleRejectCall,
        handleEndVideoCall,
        toggleMic,
        toggleVideo
    } = useStringeeContext();
    const { authUser } = useAuthContext();

    return (
        <>
            <CallDialogs
                isCalling={isCalling}
                isIncomingCall={isIncomingCall}
                selectedConversation={selectedConversation}
                callerInfo={callerInfo}
                callStatus={callStatus}
                onEndCall={handleEndVideoCall}
                onAcceptCall={handleAcceptCall}
                onRejectCall={handleRejectCall}
            />

            <VideoCallDialog
                selectedConversation={selectedConversation}
                callerInfo={callerInfo}
                authUser={authUser}
                isVideoCall={isVideoCall}
                localStream={localStream}
                remoteStream={remoteStream}
                isMuted={isMuted}
                isVideoEnabled={isVideoEnabled}
                toggleMic={toggleMic}
                toggleVideo={toggleVideo}
                handleEndVideoCall={handleEndVideoCall}
            />
        </>
    )
}

export default CallContainer
