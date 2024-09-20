const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user.Controller');
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

// router.patch('/follow/:id', verifyToken, userController.followUserController);
router.get('/:id', verifyToken, userController.getUserController);

module.exports = router;
