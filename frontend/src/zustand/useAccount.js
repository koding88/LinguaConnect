import { create } from "zustand";
import axiosClient from '@/api/axiosClient';
import { toast } from 'react-toastify';

const useAccount = create((set) => ({
    accounts: [],
    setAccounts: (accounts) => set({ accounts }),

    getAccounts: async () => {
        try {
            const { data } = await axiosClient.get('admin/accounts');
            set({ accounts: data.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch accounts');
        }
    },

    getAccountById: async (id) => {
        try {
            const { data } = await axiosClient.get(`admin/account/${id}`);
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch account');
        }
    },

    lockAccount: async (id) => {
        try {
            await axiosClient.patch(`admin/account/lock/${id}`);
            set((state) => ({
                accounts: state.accounts.map(account => account._id === id ? { ...account, status: 'block' } : account)
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to lock account');
        }
    },

    unlockAccount: async (id) => {
        try {
            await axiosClient.patch(`admin/account/unlock/${id}`);
            set((state) => ({
                accounts: state.accounts.map(account => account._id === id ? { ...account, status: 'unblock' } : account)
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to unlock account');
        }
    }
}));

export default useAccount;
