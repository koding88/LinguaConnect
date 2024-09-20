const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin.Controller");
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

router.get("/accounts", verifyToken, isAdmin, adminController.getAllUsersController);
router.get("/account/search", verifyToken, isAdmin, adminController.searchAccountController);
router.get("/account/:id", verifyToken, isAdmin, adminController.getUserByIdController);
router.patch("/account/lock/:id", verifyToken, isAdmin, adminController.lockUserByIdController);
router.patch("/account/unlock/:id", verifyToken, isAdmin, adminController.unlockUserByIdController);

module.exports = router;


