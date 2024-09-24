const adminService = require('../services/admin.Service');

const getAllUsersController = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

const getUserByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await adminService.getUserById(id);
        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const lockUserByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await adminService.lockUserById(id);
        res.status(200).json({
            status: 'success',
            message: 'User locked successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const unlockUserByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await adminService.unlockUserById(id);
        res.status(200).json({
            status: 'success',
            message: 'User unlocked successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const searchAccountController = async (req, res, next) => {
    try {
        const { key } = req.query;
        const user = await adminService.searchAccount(key);
        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const getAllGroupsController = async (req, res, next) => {
    try {
        const groups = await adminService.getAllGroups();
        res.status(200).json({
            status: 'success',
            message: 'Groups retrieved successfully',
            data: groups,
        });
    } catch (error) {
        next(error);
    }
}

const getGroupByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const group = await adminService.getGroupById(id);
        res.status(200).json({
            status: 'success',
            message: 'Group retrieved successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsersController,
    getUserByIdController,
    lockUserByIdController,
    unlockUserByIdController,
    searchAccountController,
    getAllGroupsController,
    getGroupByIdController
}