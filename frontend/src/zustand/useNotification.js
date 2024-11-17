import { create } from 'zustand';
import axiosClient from '@/api/axiosClient';

const useNotification = create((set, get) => ({
    notifications: [],
    unreadCount: 0,

    // Fetch notifications
    fetchNotifications: async () => {
        try {
            const response = await axiosClient.get('/notifications');
            const notifications = response.data.data;
            const unreadCount = notifications.filter(n => !n.isRead).length;
            set({ notifications, unreadCount });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        try {
            await axiosClient.patch(`/notifications/${notificationId}`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    // Delete notification
    deleteNotification: async (notificationId) => {
        try {
            await axiosClient.delete(`/notifications/${notificationId}`);
            set(state => ({
                notifications: state.notifications.filter(n => n._id !== notificationId)
            }));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    },

    // Group notifications by time
    groupNotifications: () => {
        const notifications = get().notifications;
        const groups = {
            new: [],
            earlier: []
        };

        notifications.forEach(notification => {
            const date = new Date(notification.createdAt);
            const now = new Date();
            const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

            if (diffHours < 24) {
                groups.new.push(notification);
            } else {
                groups.earlier.push(notification);
            }
        });

        return groups;
    },
}));

export default useNotification;
