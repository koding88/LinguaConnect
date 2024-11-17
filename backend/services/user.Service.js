const userModel = require('../models/user.Model');
const topicModel = require('../models/topic.Model');
const logger = require('../utils/loggerUtil')
const errorHandler = require('../utils/errorUtil');
const { idValidation, getUserValidation, updateUserValidation, followUserValidation, updateAvatarValidation } = require("../validations/userValidation");
const { deleteImages } = require('../utils/cloudinaryUtil');
const { getReceiverSocketId, io } = require('../sockets/sockets');
const notificationModel = require('../models/notification.Model');


const getProfile = async (userId) => {
    try {
        let projection = {password: 0, role: 0, status: 0}
        const {error} = idValidation({userId: userId});
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const profile = await userModel.findOne({
            _id: userId,
            role: { $ne: 'admin' }
        }, projection)
            .populate('followers', 'username full_name avatarUrl')
            .populate('following', 'username full_name avatarUrl')
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

const getUser = async (userInfo, userId) => {
    try {
        let projection = {email: 0, password: 0, role: 0, status: 0, isVerify: 0, isEnable2FA: 0}

        const {error} = getUserValidation({username: userInfo});
        if (error) {
            logger.error(`Error validating username: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const users = await userModel.find({
            $or: [
                { username: { $regex: userInfo, $options: 'i' } },
                { full_name: { $regex: userInfo, $options: 'i' } }
            ],
            _id: { $ne: userId },
            role: { $ne: 'admin' }
        }, projection)
            .populate('followers', 'username full_name avatarUrl')
            .populate('following', 'username full_name avatarUrl')
            .exec();

        if (users.length === 0) {
            throw errorHandler(404, 'No users found');
        }
        return users;

    } catch (error) {
        logger.error(`Error getting users: ${error.message}`);
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
        const {full_name, username, gender, birthday, location, favoriteTopics} = userData;

        // Validate user data
        const {error: userError} = updateUserValidation({
            full_name,
            username,
            gender,
            birthday,
            location,
            favoriteTopics
        });
        if (userError) {
            logger.error(`Error validating user data: ${userError.message}`);
            throw errorHandler(400, userError.message);
        }

        // Update the user object
        Object.assign(user, {full_name, username, gender, birthday, location, favoriteTopics});

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
        let projection = { password: 0, role: 0, status: 0 }

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

        // Create notification when following (not unfollowing)
        if (!isFollowing) {
            await notificationModel.create({
                user: follower,
                recipients: [following],
                content: "started following you",
                type: "follow",
                url: `/profile/${follower}`,
            });

            // Add socket emit for real-time notification
            const receiverSocketId = getReceiverSocketId(following.toString())
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification")
            }
        }

        const profile = await userModel.findById(follower, projection)
            .populate('followers', 'username full_name avatarUrl')
            .populate('following', 'username full_name avatarUrl')
            .exec();

        return profile;

    } catch (error) {
        logger.error(`Error following user: ${error.message}`);
        throw error;
    }
}

const updateAvatar = async (userId, avatar) => {
    try {
        // Validate userId
        const {error} = idValidation({userId: userId});
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Validate avatar
        // const {error: avatarError} = updateAvatarValidation({avatarUrl: avatar});
        // if (avatarError) {
        //     logger.error(`Error validating avatar URL: ${avatarError.message}`);
        //     throw errorHandler(400, avatarError.message);
        // }

        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        const oldAvatar = user.avatarUrl;
        console.log("Old avatar: ", oldAvatar)

        // Only delete old avatar if it exists and is different from the new one
        if (oldAvatar && oldAvatar !== avatar) {
            const { deletedUrls, failedUrls } = await deleteImages([oldAvatar]); // Pass as array
            if (failedUrls.length > 0) {
                logger.warn(`Failed to delete old avatar: ${oldAvatar}`);
                // Continue with update even if old avatar deletion fails
                throw errorHandler(500, 'Error deleting old avatar');
            }
        }

        user.avatarUrl = avatar;
        user.updatedAt = new Date(); // Update the 'updatedAt' timestamp

        const updatedUser = await user.save();

        // Return only necessary user information
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        return userWithoutPassword;
    } catch (error) {
        logger.error(`Error updating avatar for user ${userId}: ${error.message}`);
        throw error;
    }
}

const getTopics = async () => {
    try {
        const topics = await topicModel.find();
        return topics;
    } catch (error) {
        logger.error(`Error getting topics: ${error.message}`);
        throw error;
    }
}

module.exports = {
    followUser,
    getUser,
    updateUser,
    getProfile,
    updateAvatar,
    getTopics
}
