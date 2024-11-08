const notificationService = require('../services/notification.Service');

const getNotificationsController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const notifications = await notificationService.getNotifications(userId);

        res.status(200).json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

const markAsReadController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.markAsRead(id);

        res.status(200).json({
            status: 'success',
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

const deleteNotificationController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.deleteNotification(id);

        res.status(200).json({
            status: 'success',
            message: 'Notification deleted successfully',
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotificationsController,
    markAsReadController,
    deleteNotificationController
};
