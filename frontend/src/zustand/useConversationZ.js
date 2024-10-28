import { create } from "zustand";

const useConversationZ = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
    messages: [],
    setMessages: (messages) => set({ messages }),
    aiMessages: [],
    setAIMessages: (aiMessages) => set((state) => ({
        aiMessages: Array.isArray(aiMessages) ? aiMessages : [...state.aiMessages, aiMessages]
    })),
}));

export default useConversationZ;
