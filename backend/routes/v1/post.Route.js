const express = require('express');
const router = express.Router();
const postController = require('../../controllers/post.Controller');
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");
const {uploadImagesToCloudinary} = require("../../middlewares/upload.Middleware");

router.get("/", verifyToken, postController.getAllPostsController);
router.post("/", verifyToken, uploadImagesToCloudinary, postController.createPostController);
router.get("/:id", verifyToken, postController.getPostByIdController);
router.patch("/:id", verifyToken, uploadImagesToCloudinary, postController.updatePostController);
router.delete("/:id", verifyToken, postController.deletePostController);

module.exports = router;
