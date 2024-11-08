const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/auth.Middleware');
const notificationController = require('../../controllers/notification.Controller');

router.get('/', verifyToken, notificationController.getNotificationsController);
router.patch('/:id', verifyToken, notificationController.markAsReadController);
router.delete('/:id', verifyToken, notificationController.deleteNotificationController);

module.exports = router;
