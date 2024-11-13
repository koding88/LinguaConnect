const userService = require('../services/user.Service');

const getProfileController = async (req, res, next) => {
    try {
        const userId = req.params.id;
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
        const userId = req.userId;
        const userInfo = req.query.username;
        const users = await userService.getUser(userInfo, userId);
        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

const updateUserController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {full_name, username, gender, birthday, location, favoriteTopics} = req.body;
        const userData = {full_name, username, gender, birthday, location, favoriteTopics};

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

const getTopicsController = async (req, res, next) => {
    try {
        const topics = await userService.getTopics();
        res.status(200).json({
            status: 'success',
            message: 'Topics retrieved successfully',
            data: topics,
        });
    } catch (error) {
        next(error);
    }
}

const followUserController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const targetId = req.params.id;
        const profile = await userService.followUser(userId, targetId);
        res.status(201).json({
            status: 'success',
            message: 'User followed successfully',
            data: profile,
        })
    } catch (error) {
        next(error);
    }
}

const updateAvatarController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const avatar = Array.isArray(req.fileUrls) ? req.fileUrls[0] : req.fileUrls;
        const user = await userService.updateAvatar(userId, avatar);

        res.status(200).json({
            status: 'success',
            message: 'Avatar updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    followUserController,
    getUserController,
    updateUserController,
    getProfileController,
    updateAvatarController,
    getTopicsController
}
