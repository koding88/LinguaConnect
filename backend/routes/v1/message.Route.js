const express = require("express");
const router = express.Router();
const messageController = require("../../controllers/message.Controller");
const { verifyToken } = require("../../middlewares/auth.Middleware");

router.get("/:id", verifyToken, messageController.getAllMessagesController);
router.post("/send/:id", verifyToken, messageController.sendMessageController);

module.exports = router;
