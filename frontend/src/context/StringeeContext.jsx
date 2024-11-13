import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from '@/context/AuthContext';
import { StringeeClient, StringeeCall } from 'stringee-chat-js-sdk';
import axiosClient from '@/api/axiosClient';
import useConversationZ from '@/zustand/useConversationZ';
import { toast } from "react-toastify";

const StringeeContext = createContext();

export const useStringeeContext = () => useContext(StringeeContext);

export const StringeeContextProvider = ({ children }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversationZ();
    const [stringeeClient] = useState(new StringeeClient());
    const [currentCall, setCurrentCall] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [isVideoCall, setIsVideoCall] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callStatus, setCallStatus] = useState('');
    const [callerInfo, setCallerInfo] = useState(null);

    useEffect(() => {
        const connectStringee = async () => {
            try {
                const { data } = await axiosClient.get(`stringee/generate-token?userId=${authUser?._id}`);
                stringeeClient.connect(data.access_token);
            } catch (error) {
                console.error('Error connecting to Stringee:', error);
            }
        };

        connectStringee();
        stringeeClient.on('connect', () => console.log('Connected to Stringee'));
        stringeeClient.on('authen', (res) => console.log('Stringee authentication:', res));
        stringeeClient.on('incomingcall', handleIncomingCall);
        stringeeClient.on('authensuccess', (res) => console.log('Stringee authentication successful:', res));

        return () => stringeeClient.disconnect();
    }, []);

    const setupCallEvents = (call) => {
        call.on('addremotestream', setRemoteStream);
        call.on('addlocalstream', setLocalStream);

        call.on('signalingstate', (state) => {
            const stateHandlers = {
                2: () => { setCallStatus('rejected'); setIsCalling(false); },
                3: () => { setIsCalling(false); setIsVideoCall(true); setCallStatus('connected'); },
                4: () => handleEndVideoCall(),
                5: () => { setCallStatus('failed'); setIsCalling(false); },
                6: () => { handleEndVideoCall(); setCallStatus('busy'); }
            };
            stateHandlers[state.code]?.() || console.log('Unknown state:', state.code);
        });

        call.on('mediastate', (state) => {
            console.log(state.code === 1 ? 'Media connected' : 'No media');
        });
    };

    const handleIncomingCall = async (incomingCall) => {
        try {
            setCurrentCall(incomingCall);
            setupCallEvents(incomingCall);
            setIsIncomingCall(true);
            setIsVideoCall(false);
            const { data } = await axiosClient.get(`/users/profile/${incomingCall.fromNumber}`);
            setCallerInfo(data.data);
        } catch (error) {
            console.error('Error fetching caller info:', error);
        }
    }

    const handleStartCall = (isVideo = true) => {
        const call = new StringeeCall(stringeeClient, authUser?._id, selectedConversation?._id, isVideo);
        [setCurrentCall, setupCallEvents].forEach(fn => fn(call));
        [setCallStatus, setIsCalling].forEach(fn => fn(true));
        call.makeCall(res => console.log('make call callback:', JSON.stringify(res)));
    };

    const handleAcceptCall = () => {
        currentCall?.answer(res => {
            console.log('Call answered:', res);
            [setIsIncomingCall, setIsVideoCall, setCallStatus].forEach(fn => fn(fn === setIsVideoCall));
        });
    };

    const handleRejectCall = () => {
        currentCall?.reject(res => {
            console.log('Call rejected:', res);
            [setIsIncomingCall, setCallStatus].forEach(fn => fn(fn === setCallStatus ? 'rejected' : false));
        });
        toast.error('Call rejected');
    };

    const handleEndVideoCall = () => {
        if (currentCall) {
            currentCall.hangup(res => console.log('Call ended:', res));
        }
        setIsVideoCall(false);
        setIsCalling(false);
        setIsIncomingCall(false);
        setCallStatus('ended');
        setIsMuted(false);
        setIsVideoEnabled(true);
        setCurrentCall(null);
        toast.error('Call ended');
    };

    const toggleMic = () => {
        localStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        localStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setIsVideoEnabled(!isVideoEnabled);
    };

    const contextValue = {
        selectedConversation,
        stringeeClient,
        currentCall,
        isCalling,
        isIncomingCall,
        isVideoCall,
        isMuted,
        isVideoEnabled,
        localStream,
        remoteStream,
        callerInfo,
        callStatus,
        handleStartCall,
        handleAcceptCall,
        handleRejectCall,
        handleEndVideoCall,
        toggleMic,
        toggleVideo
    };

    return (
        <StringeeContext.Provider value={contextValue}>
            {children}
        </StringeeContext.Provider>
    );
};
