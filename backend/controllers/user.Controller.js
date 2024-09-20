const userService = require('../services/user.Service');

const getUserController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userInfo = req.params.id;
        const user = await userService.getUser(userId, userInfo);
        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const followUserController = async (req, res, next) => {
    try {
        console.log('2')
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

module.exports = {followUserController, getUserController}
