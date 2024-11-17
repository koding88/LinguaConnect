import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import useNotification from "@/zustand/useNotification";

const useListenNotification = () => {
    const { socket } = useSocketContext()
    const { fetchNotifications } = useNotification()
    
    useEffect(() => {
        if (socket) {
            fetchNotifications();
        }

        socket?.on("newNotification", () => {
            fetchNotifications();
        })

        return () => {
            socket?.off("newNotification")
        }
    }, [socket, fetchNotifications])
}

export default useListenNotification
