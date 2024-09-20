const userService = require('../services/user.Service');

const getProfileController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const profile = await userService.getProfile(userId);
        res.status(200).json({
            status: 'success',
            message: 'Profile retrieved successfully',
            data: profile,
        });
    } catch (error) {
        next(error)
    }
}

const getUserController = async (req, res, next) => {
    try {
        const userInfo = req.query.username;
        const user = await userService.getUser(userInfo);
        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const updateUserController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {full_name, username, gender, birthday, location} = req.body;
        const userData = {full_name, username, gender, birthday, location};

        const user = await userService.updateUser(userId, userData);

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}


const followUserController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const targetId = req.params.id;
        await userService.followUser(userId, targetId);
        res.status(201).json({
            status: 'success',
            message: 'User followed successfully',
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    followUserController,
    getUserController,
    updateUserController,
    getProfileController
}
