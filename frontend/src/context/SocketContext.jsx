import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from '@/context/AuthContext'
import { io } from "socket.io-client";
import useNotification from "@/zustand/useNotification";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext()
    const { fetchNotifications } = useNotification()

    useEffect(() => {
        let newSocket;

        if (authUser) {
            newSocket = io(import.meta.env.VITE_API_BACKEND_URL, {
                query: { userId: authUser._id },
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
                fetchNotifications();
            });

            newSocket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
            });

            newSocket.on("disconnect", (reason) => {
                console.log("Socket disconnected:", reason);
            });

            newSocket.on("getOnlineUsers", (users) => {
                console.log("Online users updated:", users);
                setOnlineUsers(users);
            });

            setSocket(newSocket);

            return () => {
                console.log("Cleaning up socket connection");
                if (newSocket) {
                    newSocket.off("connect");
                    newSocket.off("connect_error");
                    newSocket.off("disconnect");
                    newSocket.off("getOnlineUsers");
                    newSocket.disconnect();
                }
            };
        } else {
            if (socket) {
                console.log("Disconnecting existing socket");
                socket.disconnect();
            }
            setSocket(null);
            setOnlineUsers([]);
        }
    }, [authUser, fetchNotifications]);

    const contextValue = {
        socket,
        onlineUsers,
        isOnline: (userId) => onlineUsers.includes(userId)
    };

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
