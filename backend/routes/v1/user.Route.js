const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.Controller");
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

router.get("/", verifyToken,isAdmin, userController.getAllUsersController);
router.get("/:id", verifyToken, isAdmin, userController.getUserByIdController);
router.patch("/lock/:id", verifyToken, isAdmin, userController.lockUserByIdController);
router.patch("/unlock/:id", verifyToken, isAdmin, userController.unlockUserByIdController);

module.exports = router;


