import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from '@/context/AuthContext'
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext()

    useEffect(() => {
        let newSocket;

        if (authUser) {
            newSocket = io(import.meta.env.VITE_API_BACKEND_URL, {
                query: { userId: authUser._id }
            });

            setSocket(newSocket);

            newSocket.on("getOnlineUsers", setOnlineUsers);

            return () => {
                newSocket.off("getOnlineUsers");
                newSocket.disconnect();
            };
        } else {
            setSocket(null);
            setOnlineUsers([]);
        }
    }, [authUser]);

    const contextValue = {
        socket,
        onlineUsers,
        isOnline: (userId) => onlineUsers.includes(userId)
    };

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
