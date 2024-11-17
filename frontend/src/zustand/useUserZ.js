import { create } from 'zustand';
import { toast } from 'react-toastify';
import axiosClient from '@/api/axiosClient';

const useUserZ = create((set) => ({
    user: null,
    loading: false,
    error: null,

    getProfile: async (userId) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosClient.get(`/users/profile/${userId}`);
            set({ user: data.data, loading: false });
            return data.data
        } catch (error) {
            set({ loading: false });
            set({ error: error.response?.data?.message || 'Error fetching profile', loading: false });
            // toast.error('Failed to fetch profile');
        }
    },

    updateProfile: async (userData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosClient.post('/users', userData);
            set({ user: data.data, loading: false });
            toast.success('Profile updated successfully');
            return data.data
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error updating profile', loading: false });
            toast.error('Failed to update profile');
        }
    },

    updateAvatar: async (avatar) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosClient.patch('/users/profile/avatar', avatar, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ user: data.data, loading: false });
            toast.success('Avatar updated successfully');
            return data.data
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error updating avatar', loading: false });
            toast.error('Failed to update avatar');
        }
    },

    followUser: async (targetId) => {
        try {
            const { data } = await axiosClient.patch(`/users/follow/${targetId}`);
            set((state) => ({
                user: {
                    ...state.user,
                    following: [...(state.user?.following || []), data.data]
                }
            }));
            return data.data;
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Error following user');
        }
    },

    searchUser: async (username) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosClient.get(`/users?username=${username}`);
            return data.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error fetching user', loading: false });
            toast.error(error.response?.data?.message || 'Not found user');
            return null;
        } finally {
            set({ loading: false });
        }
    },

    changePassword: async (passwordData) => {
        try {
            const { data } = await axiosClient.post('/auth/change-password', passwordData);
            toast.success('Password updated successfully');
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating password');
        }
    },

    clearUser: () => set({ user: null, error: null }),

    enable2FA: async () => {
        try {
            const { data } = await axiosClient.get('/auth/enable-2fa');
            toast.success('2FA enabled successfully');
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error enabling 2FA');
            throw error;
        }
    },

    disable2FA: async () => {
        try {
            await axiosClient.get('/auth/disable-2fa');
            toast.success('2FA disabled successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error disabling 2FA');
            throw error;
        }
    },
}));

export default useUserZ;
