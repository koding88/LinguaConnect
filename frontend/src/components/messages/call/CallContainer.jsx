import React from 'react'
import { useStringeeContext } from '@/context/StringeeContext'
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

    // Markdown content for video call
    const markdown = `
    ### 🌅 Morning Routine Discussion

    **A**: Good morning! What time do you usually wake up? ⏰

    **B**: Hi! I&apos;m an early bird - I wake up at 6 AM every day. How about you? 🌄
    `

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
                isVideoCall={isVideoCall}
                localStream={localStream}
                remoteStream={remoteStream}
                isMuted={isMuted}
                isVideoEnabled={isVideoEnabled}
                toggleMic={toggleMic}
                toggleVideo={toggleVideo}
                handleEndVideoCall={handleEndVideoCall}
                markdown={markdown}
            />
        </>
    )
}

export default CallContainer
