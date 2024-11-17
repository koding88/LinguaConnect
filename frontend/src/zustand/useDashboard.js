import { create } from "zustand";
import axiosClient from "@/api/axiosClient";
import { toast } from "react-toastify";

const useDashboard = create((set) => ({
    dashboardData: null,
    setDashboardData: (data) => set({ dashboardData: data }),

    monthlyUserRegistrationTrend: null,
    setMonthlyUserRegistrationTrend: (data) => set({ monthlyUserRegistrationTrend: data }),

    contentTypeMetrics: null,
    setContentTypeMetrics: (data) => set({ contentTypeMetrics: data }),

    top3GroupsMostMembers: null,
    setTop3GroupsMostMembers: (data) => set({ top3GroupsMostMembers: data }),

    top5TrendingPosts: null,
    setTop5TrendingPosts: (data) => set({ top5TrendingPosts: data }),

    getTotalSystems: async () => {
        try {
            const { data } = await axiosClient.get('/admin/dashboard');
            set({ dashboardData: data.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    },

    getMonthlyUserRegistrationTrend: async () => {
        try {
            const { data } = await axiosClient.get('/admin/dashboard/monthly-user-registration-trend');
            set({ monthlyUserRegistrationTrend: data.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch monthly user registration trend');
        }
    },

    getContentTypeMetrics: async () => {
        try {
            const { data } = await axiosClient.get('/admin/dashboard/content-type-metrics');
            set({ contentTypeMetrics: data.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch content type metrics');
        }
    },

    getTop3GroupsMostMembers: async () => {
        try {
            const { data } = await axiosClient.get('/admin/dashboard/top-3-groups-most-members');
            set({ top3GroupsMostMembers: data.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch top 3 groups most members');
        }
    },

    getTop5TrendingPosts: async () => {
        try {
            const { data } = await axiosClient.get('/admin/dashboard/top-5-trending-posts');
            set({ top5TrendingPosts: data.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch top 5 trending posts');
        }
    },


}));

export default useDashboard;