const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user.Controller');
const { verifyToken, isAdmin } = require("../../middlewares/auth.Middleware");
const { uploadImagesToCloudinary } = require("../../middlewares/upload.Middleware");

router.patch('/follow/:id', verifyToken, userController.followUserController);
router.get('/profile/:id', verifyToken, userController.getProfileController);
router.patch('/profile/avatar', verifyToken, uploadImagesToCloudinary, userController.updateAvatarController);
router.get('/', verifyToken, userController.getUserController);
router.post('/', verifyToken, userController.updateUserController);

module.exports = router;
