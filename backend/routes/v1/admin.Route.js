const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin.Controller");
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

router.get("/accounts", verifyToken, isAdmin, userController.getAllUsersController);
router.get("/account/search", verifyToken, isAdmin, userController.searchAccountController);
router.get("/account/:id", verifyToken, isAdmin, userController.getUserByIdController);
router.patch("/account/lock/:id", verifyToken, isAdmin, userController.lockUserByIdController);
router.patch("/account/unlock/:id", verifyToken, isAdmin, userController.unlockUserByIdController);

module.exports = router;


