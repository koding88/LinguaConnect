const notificationModel = require('../models/notification.Model');

const getNotifications = async (userId) => {
    try {
        const notifications = await notificationModel.find({
            recipients: userId
        })
        .populate('user', 'username avatarUrl')
        .sort({ createdAt: -1 });

        return notifications;
    } catch (error) {
        throw error;
    }
};

const markAsRead = async (notificationId) => {
    try {
        const notification = await notificationModel.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );
        return notification;
    } catch (error) {
        throw error;
    }
};

const deleteNotification = async (notificationId) => {
    try {
        const notification = await notificationModel.findByIdAndDelete(notificationId);
        return notification;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    deleteNotification
};
