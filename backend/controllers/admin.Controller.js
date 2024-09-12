const userService = require('../services/user.Service');

const getAllUsersController = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
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
        const user = await userService.getUserById(id);
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
        const user = await userService.lockUserById(id);
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
        const user = await userService.unlockUserById(id);
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
        if (!key) {
            return res.status(400).json({
                status: 'error',
                message: 'Search term is required',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: key,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {getAllUsersController, getUserByIdController, lockUserByIdController, unlockUserByIdController, searchAccountController}