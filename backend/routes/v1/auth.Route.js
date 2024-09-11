const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.Controller");
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/refresh-token", authController.refreshTokenController);
router.get("/confirm", authController.confirmEmailController);
router.post("/change-password", verifyToken, authController.changePasswordController);
router.post("/forgot-password", authController.forgotPasswordController);
router.post("/reset-password", authController.resetPasswordController);
router.get("/enable-2fa", verifyToken, authController.enable2FAController);
router.get("/disable-2fa", verifyToken, authController.disable2FAController);
router.get("/google", authController.loginGoogleController)
router.get("/google/redirect", authController.loginGoogleRedirectController);

module.exports = router;
