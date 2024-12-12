import { create } from "zustand";
import axiosClient from '@/api/axiosClient';
import { toast } from 'react-toastify';

const useTopic = create((set) => ({
    topics: [],
    pagination: null,
    loading: false,
    setTopics: (topics) => set({ topics }),

    getTopics: async (page = 1, limit = 10) => {
        try {
            set({ loading: true });
            const { data } = await axiosClient.get('/admin/topics', { params: { page, limit } });
            set({ 
                topics: data.data.topics, 
                pagination: data.data.pagination,
                loading: false 
            });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || 'Error fetching topics');
        }
    },

    getTopicByIdManage: async (topicId) => {
        try {
            const { data } = await axiosClient.get(`/admin/topics/${topicId}`);
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching topic');
            return null;
        }
    },

    createTopic: async (topic) => {
        try {
            const { data } = await axiosClient.post('/admin/topics', topic);
            set((state) => ({
                topics: [...state.topics, data.data]
            }));
            toast.success('Topic created successfully');
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating topic');
            return null;
        }
    },

    updateTopic: async (topicId, topic) => {
        try {
            const { data } = await axiosClient.patch(`/admin/topics/${topicId}`, topic);
            set((state) => ({
                topics: state.topics.map(topic => topic._id === topicId ? data.data : topic)
            }));
            toast.success('Topic updated successfully');
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating topic');
            return null;
        }
    },

    deleteTopic: async (topicId) => {
        try {
            await axiosClient.delete(`/admin/topics/${topicId}`);
            set((state) => ({
                topics: state.topics.filter(topic => topic._id !== topicId)
            }));
            toast.success('Topic deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting topic');
        }
    }
}))

export default useTopic;
