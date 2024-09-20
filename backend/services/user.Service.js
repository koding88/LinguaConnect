const userModel = require('../models/user.Model');
const logger = require('../utils/loggerUtil')
const errorHandler = require('../utils/errorUtil');

var projection = {password: 0, status: 0, role: 0};

const getUser = async (userId, userInfo) => {
    try {
        if(!(userId === userInfo)) {
            projection = {email: 0, password: 0, role: 0, status: 0, isVerify: 0, isEnable2FA: 0}
        }

        const user = await userModel.findById(userInfo, projection)
            .populate('followers', 'username full_name')
            .populate('following', 'username full_name')
            .exec();
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        return user;

    } catch (error) {
        logger.error(`Error getting user: ${error.message}`);
        throw error;
    }
}

const followUser = async (follower, following) => {
    try {
        if (follower === following) {
            throw errorHandler(400, 'You cannot follow yourself');
        }

        const userFollower = await userModel.findById(follower);
        if (!userFollower) {
            throw errorHandler(404, 'Follower not found');
        }

        const userFollowing = await userModel.findById(following);
        if (!userFollowing) {
            throw errorHandler(404, 'Following user not found');
        }

        // Toggle following status
        const isFollowing = userFollower.following.includes(following);
        isFollowing ? userFollower.following.pull(following) : userFollower.following.push(following);

        // Toggle follower status
        const isFollower = userFollowing.followers.includes(follower);
        isFollower ? userFollowing.followers.pull(follower) : userFollowing.followers.push(follower);

        await Promise.all([userFollower.save(), userFollowing.save()]);

        return {message: 'User followed successfully'};

    } catch (error) {
        logger.error(`Error following user: ${error.message}`);
        throw error;
    }
}


module.exports = {
    followUser,
    getUser
}