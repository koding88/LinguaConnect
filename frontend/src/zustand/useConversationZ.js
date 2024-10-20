import { create } from "zustand";

const useConversationZ = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
    messages: [],
    setMessages: (messages) => set({ messages }),
}));

export default useConversationZ;
