const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin.Controller");
const {verifyToken, isAdmin} = require("../../middlewares/auth.Middleware");

// Accounts
router.get("/accounts", verifyToken, isAdmin, adminController.getAllUsersController);
router.get("/account/search", verifyToken, isAdmin, adminController.searchAccountController);
router.get("/account/:id", verifyToken, isAdmin, adminController.getUserByIdController);
router.patch("/account/lock/:id", verifyToken, isAdmin, adminController.lockUserByIdController);
router.patch("/account/unlock/:id", verifyToken, isAdmin, adminController.unlockUserByIdController);

// Groups
router.get("/groups", verifyToken, isAdmin, adminController.getAllGroupsController);
router.get("/groups/:id", verifyToken, isAdmin, adminController.getGroupByIdController);
router.patch("/groups/block/:id", verifyToken, isAdmin, adminController.blockGroupByIdController);
router.patch("/groups/unblock/:id", verifyToken, isAdmin, adminController.unblockGroupByIdController);

// Posts
router.get("/posts", verifyToken, isAdmin, adminController.getAllPostsController);
router.get("/posts/:id", verifyToken, isAdmin, adminController.getPostByIdController);
router.patch("/posts/hide/:id", verifyToken, isAdmin, adminController.hidePostByIdController);
router.patch("/posts/unhide/:id", verifyToken, isAdmin, adminController.unhidePostByIdController);

// Topics
router.get("/topics", verifyToken, isAdmin, adminController.getAllTopicsController);
router.get("/topics/:id", verifyToken, isAdmin, adminController.getTopicByIdController);
router.post("/topics", verifyToken, isAdmin, adminController.createTopicController);
router.patch("/topics/:id", verifyToken, isAdmin, adminController.updateTopicByIdController);
router.delete("/topics/:id", verifyToken, isAdmin, adminController.deleteTopicByIdController);

// Dashboard
router.get("/dashboard", verifyToken, isAdmin, adminController.getDashboardController);
router.get("/dashboard/monthly-user-registration-trend", verifyToken, isAdmin, adminController.getMonthlyUserRegistrationTrendController);
router.get("/dashboard/content-type-metrics", verifyToken, isAdmin, adminController.getContentTypeMetricsController);
router.get("/dashboard/top-3-groups-most-members", verifyToken, isAdmin, adminController.getTop3GroupsMostMembersController);
router.get("/dashboard/top-5-trending-posts", verifyToken, isAdmin, adminController.getTop5TrendingPostsController);

module.exports = router;


