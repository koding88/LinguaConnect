const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user.Controller');
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

router.patch('/follow/:id', verifyToken, userController.followUserController);
router.get('profile', verifyToken, userController.getUserController);
router.get('/', verifyToken, userController.getProfileController);
router.post('/', verifyToken, userController.updateUserController);

module.exports = router;
