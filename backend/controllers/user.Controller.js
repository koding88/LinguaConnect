const userService = require('../services/user.Service');

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

module.exports = {followUserController}
