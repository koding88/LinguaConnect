const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group.Controller');
const {verifyToken, isAdmin} = require('../../middlewares/auth.Middleware');

router.get('/', verifyToken, groupController.getAllGroupsController);
router.get('/:id', verifyToken, groupController.getGroupByIdController);
router.post('/', verifyToken, groupController.createGroupController);
router.put('/:id', verifyToken, groupController.updateGroupController);
router.delete('/:id', verifyToken, groupController.deleteGroupController);
router.patch('/settings/limit-members/:id', verifyToken, groupController.limitGroupMembersController);
router.post('/remove-member/:id', verifyToken, groupController.removeGroupMemberController);
router.post('/join/:id', verifyToken, groupController.joinGroupController);
router.post('/leave/:id', verifyToken, groupController.leaveGroupController);

module.exports = router;
