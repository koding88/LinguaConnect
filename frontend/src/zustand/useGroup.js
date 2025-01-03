import { create } from "zustand";
import axiosClient from '@/api/axiosClient';
import { toast } from 'react-toastify';

const useGroup = create((set) => ({
    groups: [],
    pagination: null,
    loading: false,
    setGroups: (groups) => set({ groups }),

    getGroups: async (page = 1, limit = 10) => {
        try {
            set({ loading: true });
            const { data } = await axiosClient.get('admin/groups', {
                params: { page, limit }
            });
            set({ 
                groups: data.data.groups, 
                pagination: data.data.pagination,
                loading: false 
            });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || 'Failed to fetch groups');
        }
    },

    getGroupDetail: async (id) => {
        try {
            const { data } = await axiosClient.get(`admin/groups/${id}`);
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch group detail');
        }
    },

    blockGroup: async (id) => {
        try {
            await axiosClient.patch(`admin/groups/block/${id}`);
            set((state) => ({
                groups: state.groups.map(group => group._id === id ? { ...group, status: 'blocked' } : group)
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to block group');
        }
    },

    unblockGroup: async (id) => {
        try {
            await axiosClient.patch(`admin/groups/unblock/${id}`);
            set((state) => ({
                groups: state.groups.map(group => group._id === id ? { ...group, status: 'active' } : group)
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to unblock group');
        }
    }
}))

export default useGroup;
