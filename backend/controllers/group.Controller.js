const groupService = require('../services/group.Service');

const getAllGroupsController = async (req, res, next) => {
    try {
        const groups = await groupService.getAllGroups();

        res.status(200).json({
            status: 'success',
            message: 'Groups fetched successfully',
            data: groups,
        });
    } catch (error) {
        next(error);
    }
}

const getGroupByIdController = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const group = await groupService.getOneGroup(groupId);

        res.status(200).json({
            status: 'success',
            message: 'Group fetched successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const createGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {name, description} = req.body;

        const group = await groupService.createGroup({name, description, userId});

        res.status(201).json({
            status: 'success',
            message: 'Group created successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const updateGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const {name, description} = req.body;

        const group = await groupService.updateGroup(groupId, userId, {name, description});

        res.status(200).json({
            status: 'success',
            message: 'Group updated successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const deleteGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;

        await groupService.deleteGroup(groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Group deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

const limitGroupMembersController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const {maxMembers} = req.body;

        const group = await groupService.limitGroupMembers(groupId, userId, maxMembers);

        res.status(200).json({
            status: 'success',
            message: 'Group members limited successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const removeGroupMemberController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const {memberId} = req.body;

        await groupService.removeGroupMember(groupId, userId, memberId);

        res.status(200).json({
            status: 'success',
            message: 'Group member removed successfully',
        });
    } catch (error) {
        next(error);
    }
}

const joinGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;

        await groupService.joinGroup(groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Joined group successfully',
        });
    } catch (error) {
        next(error);
    }
}

const leaveGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;

        await groupService.leaveGroup(groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Left group successfully',
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllGroupsController,
    getGroupByIdController,
    createGroupController,
    updateGroupController,
    deleteGroupController,
    limitGroupMembersController,
    removeGroupMemberController,
    joinGroupController,
    leaveGroupController
}