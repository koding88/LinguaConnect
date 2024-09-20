const userModel = require('../models/user.Model');
const logger = require('../utils/loggerUtil')
const errorHandler = require('../utils/errorUtil');

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
    followUser
}