import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import useNotification from "@/zustand/useNotification";

const useListenAdminNotification = () => {
    const { socket } = useSocketContext()
    const { fetchNotifications } = useNotification()

    useEffect(() => {
        // Initial fetch when component mounts
        if (socket) {
            fetchNotifications();
        }

        socket?.on("admin-notification", () => {
            fetchNotifications();
        })
        return () => socket?.off("admin-notification")
    }, [socket, fetchNotifications])
}

export default useListenAdminNotification
