const express = require('express');
const router = express.Router();

const commentController = require('../../controllers/comment.Controller');
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

// router.get("/", verifyToken, commentController.getAllCommentsController);
router.post("/:id", verifyToken, commentController.createCommentController);
// router.get("/:id", verifyToken, commentController.getCommentByIdController);
router.patch("/:id", verifyToken, commentController.updateCommentController);
router.delete("/:id", verifyToken, commentController.deleteCommentController);

module.exports = router;