const userModel = require('../models/user.Model');
const logger = require('../utils/loggerUtil')
const errorHandler = require('../utils/errorUtil');
const {idValidation, getUserValidation, updateUserValidation, followUserValidation} = require("../validations/userValidation");

const getProfile = async (userId) => {
    try {
        let projection = {password: 0, role: 0, status: 0}
        const {error} = idValidation({userId: userId});
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const profile = await userModel.findById(userId, projection)
            .populate('followers', 'username full_name')
            .populate('following', 'username full_name')
            .exec();

        if (!profile) {
            throw errorHandler(404, 'User not found');
        }

        return profile;

    } catch (error) {
        logger.error(`Error getting profile: ${error.message}`);
        throw error;
    }
}

const getUser = async (userInfo) => {
    try {
        let projection = {email: 0, password: 0, role: 0, status: 0, isVerify: 0, isEnable2FA: 0}

        const {error} = getUserValidation({username: userInfo});
        if (error) {
            logger.error(`Error validating username: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const user = await userModel.findOne({username: userInfo}, projection)
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

const updateUser = async (userId, userData) => {
    try {
        // Validate user ID
        const {error: idError} = idValidation({userId});
        if (idError) {
            logger.error(`Error validating ID: ${idError.message}`);
            throw errorHandler(400, idError.message);
        }

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Destructure userData safely
        const {full_name, username, gender, birthday, location} = userData;

        // Validate user data
        const {error: userError} = updateUserValidation({
            full_name,
            username,
            gender,
            birthday,
            location,
        });
        if (userError) {
            logger.error(`Error validating user data: ${userError.message}`);
            throw errorHandler(400, userError.message);
        }

        // Update the user object
        Object.assign(user, {full_name, username, gender, birthday, location});

        // Save the updated user
        await user.save();

        return user;
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        throw error;
    }
};


const followUser = async (follower, following) => {
    try {
        const {error} = followUserValidation({follower: follower, following: following});
        if (error) {
            logger.error(`Error validating follow ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

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
    getUser,
    updateUser,
    getProfile
}