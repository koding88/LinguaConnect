const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.Controller");

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/refresh-token", authController.refreshTokenController);
router.get("/confirm", authController.confirmEmailController);

module.exports = router;
