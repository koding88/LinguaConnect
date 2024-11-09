import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from '@/context/AuthContext'
import { useSocketContext } from '@/context/SocketContext';
import { Peer } from "peerjs";
import { toast } from "react-toastify";

const PeerContext = createContext();

export const usePeerContext = () => useContext(PeerContext);

export const PeerContextProvider = ({ children }) => {
    const [peer, setPeer] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [currentCall, setCurrentCall] = useState(null);
    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();

    useEffect(() => {
        if (authUser) {
            const newPeer = new Peer(authUser._id, {
                host: 'localhost',
                port: 3000,
                path: '/api/v1/video-call/peerjs'
            });

            newPeer.on('open', (id) => {
                console.log("PeerJS connected with ID:", id);
                setPeer(newPeer);
            });

            newPeer.on('call', async (incomingCall) => {
                console.log("Receiving call from:", incomingCall.peer);
                setCurrentCall(incomingCall);

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                    });
                    setLocalStream(stream);

                    incomingCall.answer(stream);

                    incomingCall.on('stream', (remoteVideoStream) => {
                        console.log("Received remote stream");
                        setRemoteStream(remoteVideoStream);
                    });
                } catch (error) {
                    console.error("Error answering call:", error);
                    toast.error("Could not access camera/microphone");
                }
            });

            return () => {
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
                if (newPeer) newPeer.destroy();
            };
        }
    }, [authUser]);

    const createRoom = async () => {
        try {
            console.log("Creating room...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);

            const roomId = `room_${Date.now()}`;
            socket.emit("room:create", {
                roomId,
                userId: authUser._id
            });
            setCurrentRoom(roomId);
            return roomId;
        } catch (error) {
            console.error("Error creating room:", error);
            toast.error("Could not access camera/microphone");
            return null;
        }
    };

    const joinRoom = async (roomId, remotePeerId) => {
        try {
            console.log("Joining room...", roomId);
            console.log("Calling peer:", remotePeerId);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);

            const call = peer.call(remotePeerId, stream);
            setCurrentCall(call);

            call.on('stream', (incomingStream) => {
                console.log("Received remote stream in join room");
                setRemoteStream(incomingStream);
            });

            socket.emit("call:accept", {
                roomId,
                userId: authUser._id
            });

            setCurrentRoom(roomId);
            return true;
        } catch (error) {
            console.error("Error joining room:", error);
            toast.error("Could not join video call");
            return false;
        }
    };

    const leaveRoom = () => {
        if (currentCall) {
            currentCall.close();
            setCurrentCall(null);
        }
        if (currentRoom) {
            console.log("Ending call in room:", currentRoom);
            socket.emit("call:end", { roomId: currentRoom });
            if (localStream) {
                console.log("Stopping local stream tracks");
                localStream.getTracks().forEach(track => {
                    console.log("Stopping local track:", track.kind);
                    track.stop();
                    console.log("Local track stopped");
                    console.log('status local', track.readyState);
                });
            }
            if (remoteStream) {
                console.log("Stopping remote stream tracks");
                remoteStream.getTracks().forEach(track => {
                    console.log("Stopping remote track:", track.kind);
                    track.stop();
                    console.log("Remote track stopped");
                    console.log('status remote', track.readyState);
                });
            }
            console.log("Resetting streams and room state");
            setLocalStream(null);
            setRemoteStream(null);
            setCurrentRoom(null);
        }
    };

    const value = {
        peer,
        localStream,
        remoteStream,
        currentRoom,
        createRoom,
        joinRoom,
        leaveRoom
    };

    return (
        <PeerContext.Provider value={value}>
            {children}
        </PeerContext.Provider>
    );
};
