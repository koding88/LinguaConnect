import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import useConversationZ from "@/zustand/useConversationZ";
import notificationSound from "@/assets/sounds/notification.mp3"

const useListenMessages = () => {
    const { socket } = useSocketContext()
    const { messages, setMessages, selectedConversation } = useConversationZ()

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const isCurrentConversation = 
                newMessage.senderId === selectedConversation?._id || 
                newMessage.receiverId === selectedConversation?._id;

            if (isCurrentConversation) {
                newMessage.shouldShake = true;
                const sound = new Audio(notificationSound);
                sound.play();
                setMessages([...messages, newMessage]);
            }
        });
        
        return () => socket?.off("newMessage")
    }, [socket, setMessages, messages, selectedConversation]);
}

export default useListenMessages
