const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.Controller");
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/refresh-token", authController.refreshTokenController);
router.get("/confirm", authController.confirmEmailController);
router.post("/change-password", verifyToken, authController.changePasswordController);

module.exports = router;
