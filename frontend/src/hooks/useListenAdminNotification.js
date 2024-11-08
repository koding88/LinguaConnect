import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import useNotification from "@/zustand/useNotification";

const useListenAdminNotification = () => {
    const { socket } = useSocketContext()
    const { fetchNotifications } = useNotification()

    useEffect(() => {
        // Fetch notifications when component mounts
        fetchNotifications();

        socket?.on("admin-notification", () => {
            fetchNotifications();
        })
        return () => socket?.off("admin-notification")
    }, [socket, fetchNotifications])
}

export default useListenAdminNotification
