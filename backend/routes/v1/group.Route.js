const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/group.Controller');
const {verifyToken, isAdmin} = require('../../middlewares/auth.Middleware');

router.get('/', verifyToken, groupController.getAllGroupsController);
router.get('/:id', verifyToken, groupController.getGroupByIdController);
router.post('/', verifyToken, groupController.createGroupController);
router.put('/:id', verifyToken, groupController.updateGroupController);
router.delete('/:id', verifyToken, groupController.deleteGroupController);


module.exports = router;