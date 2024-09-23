const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group.Controller');
const {verifyToken, isAdmin} = require('../../middlewares/auth.Middleware');
const {uploadImagesToCloudinary} = require('../../middlewares/upload.Middleware');

router.get('/', verifyToken, groupController.getAllGroupsController);
router.get('/:id', verifyToken, groupController.getGroupByIdController);
router.post('/', verifyToken, groupController.createGroupController);
router.put('/:id', verifyToken, groupController.updateGroupController);
router.delete('/:id', verifyToken, groupController.deleteGroupController);
router.patch('/settings/limit-members/:id', verifyToken, groupController.limitGroupMembersController);
router.post('/settings/remove-member/:id', verifyToken, groupController.removeGroupMemberController);
router.post('/join/:id', verifyToken, groupController.joinGroupController);
router.post('/leave/:id', verifyToken, groupController.leaveGroupController);

// Post in group
router.get('/:id/posts', verifyToken, groupController.getAllPostsInGroupController);
router.post('/:id/posts', verifyToken, uploadImagesToCloudinary, groupController.createPostInGroupController);
router.patch('/:id/posts/:postId', verifyToken, uploadImagesToCloudinary, groupController.updatePostInGroupController);
router.delete('/:id/posts/:postId', verifyToken, groupController.deletePostInGroupController);
router.patch('/:id/posts/:postId/like', verifyToken, groupController.likePostInGroupController);

module.exports = router;
