const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin.Controller");
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

router.get("/accounts", verifyToken, isAdmin, adminController.getAllUsersController);
router.get("/account/search", verifyToken, isAdmin, adminController.searchAccountController);
router.get("/account/:id", verifyToken, isAdmin, adminController.getUserByIdController);
router.patch("/account/lock/:id", verifyToken, isAdmin, adminController.lockUserByIdController);
router.patch("/account/unlock/:id", verifyToken, isAdmin, adminController.unlockUserByIdController);
router.get("/groups", verifyToken, isAdmin, adminController.getAllGroupsController);
router.get("/groups/:id", verifyToken, isAdmin, adminController.getGroupByIdController);
router.patch("/groups/block/:id", verifyToken, isAdmin, adminController.blockGroupByIdController);
router.patch("/groups/unblock/:id", verifyToken, isAdmin, adminController.unblockGroupByIdController);
router.get("/posts", verifyToken, isAdmin, adminController.getAllPostsController);
router.get("/posts/:id", verifyToken, isAdmin, adminController.getPostByIdController);
router.patch("/posts/hide/:id", verifyToken, isAdmin, adminController.hidePostByIdController);
router.patch("/posts/unhide/:id", verifyToken, isAdmin, adminController.unhidePostByIdController);

module.exports = router;


