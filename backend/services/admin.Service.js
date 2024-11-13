const userModel = require('../models/user.Model');
const groupModel = require('../models/group.Model');
const postModel = require('../models/post.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const { IdValidation, searchAccountValidation } = require("../validations/adminValidation");

const projection = { password: 0 };

const getAllUsers = async () => {
    try {
        return await userModel.find({ role: 'user' }, projection).exec();
    } catch (error) {
        logger.error(`Error in getAllUsers: ${error}`);
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const user = await userModel.findById(id, projection).exec();
        if (!user) {
            throw errorHandler(404, `User with ID ${id} not found`);
        }

        return user;
    } catch (error) {
        logger.error(`Error fetching user with ${id}:`, error);
        throw error;
    }
};

const lockUserById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const user = await userModel.findById(id).exec();

        if (!user) {
            throw errorHandler(404, `User with ID ${id} not found`);
        }

        if (user.status === "block") {
            throw errorHandler(400, `User with ID ${id} is already locked`);
        }

        user.status = "block";
        await user.save();
        return user

    } catch (error) {
        logger.error(`Error locking user with ID ${id}:`, error);
        throw error;
    }
}

const unlockUserById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const user = await userModel.findById(id).exec();

        if (!user) {
            throw errorHandler(404, `User with ID ${id} not found`);
        }

        user.status = "unblock";
        await user.save();
        return user

    } catch (error) {
        logger.error(`Error unlocking user with ID ${id}:`, error);
        throw error;
    }
}

const searchAccount = async (key) => {
    try {
        const { error } = searchAccountValidation({ key });
        if (error) {
            logger.error(`Error validating search key: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const users = await userModel.find({
            $or: [
                { email: { $regex: key, $options: 'i' } },
                { username: { $regex: key, $options: 'i' } },
                { full_name: { $regex: key, $options: 'i' } }
            ]
        }, projection).exec();

        return users;

    } catch (error) {
        logger.error(`Error searching account: ${error}`);
        throw error;
    }
};

const getAllGroups = async () => {
    try {
        const groups = await groupModel.find({})
            .populate('owner', 'username full_name')
            .populate('members', 'username full_name')
            .exec();
        return groups;
    } catch (error) {
        logger.error(`Error fetching all groups: ${error}`);
        throw error;
    }
}

const getGroupById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const group = await groupModel.findById(id)
            .populate('owner', 'username full_name avatarUrl')
            .populate('members', 'username full_name avatarUrl')
            .populate({
                path: 'posts',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl'
                }
            })
            .populate({
                path: 'posts',
                populate: {
                    path: 'comments',
                    select: 'content user likes',
                    populate: {
                        path: 'user likes',
                        select: 'username full_name avatarUrl'
                    }
                }
            })
            .exec();

        if (!group) {
            throw errorHandler(404, `Group with ID ${id} not found`);
        }

        return group;
    } catch (error) {
        logger.error(`Error fetching group with ID ${id}:`, error);
        throw error;
    }
}

const blockGroupById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const group = await groupModel.findById(id).exec();

        if (!group) {
            throw errorHandler(404, `Group with ID ${id} not found`);
        }

        if (group.status === "blocked") {
            throw errorHandler(400, `Group with ID ${id} is already blocked`);
        }

        group.status = "blocked";
        await group.save();
        return group;
    } catch (error) {
        logger.error(`Error blocking group with ID ${id}:`, error);
        throw error;
    }
}

const unblockGroupById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const group = await groupModel.findById(id).exec();

        if (!group) {
            throw errorHandler(404, `Group with ID ${id} not found`);
        }

        if (group.status === "active") {
            throw errorHandler(400, `Group with ID ${id} is already unblocked`);
        }

        group.status = "active";
        await group.save();
        return group;
    } catch (error) {
        logger.error(`Error unblocking group with ID ${id}:`, error);
        throw error;
    }
}

const getAllPosts = async () => {
    try {
        const posts = await postModel.find({})
            .populate('user', 'username full_name')
            .populate('likes', 'username full_name')
            .populate('comments', 'content user likes')
            .populate('group', 'name')
            .exec();
        return posts;
    } catch (error) {
        logger.error(`Error fetching all posts: ${error}`);
        throw error;
    }
}

const getPostById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const post = await postModel.findById(id)
            .populate('user', 'username full_name avatarUrl')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl'
                },
                select: 'content user likes createdAt'
            })
            .populate('group', 'name')
            .exec();

        if(!post){
            throw errorHandler(404, `Post with ID ${id} not found`);
        }

        logger.info(`Post with ID ${id} retrieved successfully`);

        return post;
    } catch (error) {
        logger.error(`Error fetching post with ID ${id}:`, error);
        throw error;
    }
}

const hidePostById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const post = await postModel.findById(id).exec();

        if(!post){
            throw errorHandler(404, `Post with ID ${id} not found`);
        }

        post.status = "hidden";
        await post.save();
        return post;
    } catch (error) {
        logger.error(`Error hiding post with ID ${id}:`, error);
        throw error;
    }
}

const unhidePostById = async (id) => {
    try {
        const { error } = IdValidation({ id });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const post = await postModel.findById(id).exec();

        if (!post) {
            throw errorHandler(404, `Post with ID ${id} not found`);
        }

        post.status = "public";
        await post.save();
        return post;
    } catch (error) {
        logger.error(`Error unhiding post with ID ${id}:`, error);
        throw error;
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    lockUserById,
    unlockUserById,
    searchAccount,
    getAllGroups,
    getGroupById,
    blockGroupById,
    unblockGroupById,
    getAllPosts,
    getPostById,
    hidePostById,
    unhidePostById
}
