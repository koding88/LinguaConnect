const userModel = require('../models/user.Model');
const groupModel = require('../models/group.Model');
const postModel = require('../models/post.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const { IdValidation, searchAccountValidation } = require("../validations/adminValidation");

const projection = { password: 0 };

const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            userModel.find({ role: 'user' }, projection).skip(skip).limit(limit).exec(),
            userModel.countDocuments({ role: 'user' }).exec()
        ]);
        return { users, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
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

const getAllGroups = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const [groups, total] = await Promise.all([
            groupModel.find({})
                .populate('owner', 'username full_name')
                .populate('members', 'username full_name')
                .skip(skip)
                .limit(limit)
                .exec(),
            groupModel.countDocuments({})
        ]);
        return { groups, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
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

const getAllPosts = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        
        const [posts, total] = await Promise.all([
            postModel.find({})
                .populate('user', 'username full_name')
                .populate('likes', 'username full_name')
                .populate('comments', 'content user likes')
                .populate('group', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            postModel.countDocuments({})
        ]);

        return {
            posts,
            pagination: {
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            }
        };
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
            .populate({
                path: 'likes',
                select: 'username full_name avatarUrl location'
            })
            .populate({
                path: 'comments',
                populate: [{
                    path: 'user',
                    select: 'username full_name avatarUrl'
                }, {
                    path: 'likes',
                    select: 'username full_name avatarUrl'
                }],
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

const getDashboard = async () => {
    try {
        const users = await userModel.countDocuments({ role: 'user' }).exec();
        const groups = await groupModel.countDocuments({}).exec();
        const posts = await postModel.countDocuments({}).exec();
        return { users, groups, posts };
    } catch (error) {
        logger.error(`Error fetching dashboard:`, error);
        throw error;
    }
}

const getMonthlyUserRegistrationTrend = async () => {
    try {
        const currentDate = new Date();
        const lastYear = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        
        const users = await userModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastYear }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]).exec();

        return users;
    } catch (error) {
        logger.error('Error getting monthly user registration trend:', error);
        throw error;
    }
}

const getContentTypeMetrics = async () => {
    try {
        const contentTypeMetrics = await postModel.aggregate([
            {
                $project: {
                    contentType: {
                        $switch: {
                            branches: [
                                {
                                    // Only text (has content but no images)
                                    case: {
                                        $and: [
                                            { $eq: [{ $size: "$images" }, 0] },
                                            { $ne: ["$content", ""] },
                                            { $ne: ["$content", null] }
                                        ]
                                    },
                                    then: "text_only"
                                },
                                {
                                    // Text + images
                                    case: {
                                        $and: [
                                            { $gt: [{ $size: "$images" }, 0] },
                                            { $ne: ["$content", ""] },
                                            { $ne: ["$content", null] }
                                        ]
                                    },
                                    then: "text_and_images"
                                }
                            ],
                            // No content (only images or empty)
                            default: "images_only"
                        }
                    },
                    likes: { $size: "$likes" },
                    comments: { $size: "$comments" }
                }
            },
            {
                $group: {
                    _id: "$contentType",
                    count: { $sum: 1 },
                    totalLikes: { $sum: "$likes" },
                    totalComments: { $sum: "$comments" }
                }
            },
            {
                $project: {
                    contentType: "$_id",
                    count: 1,
                    likes: "$totalLikes",
                    comments: "$totalComments",
                    _id: 0
                }
            }
        ]).exec();

        return contentTypeMetrics;
    } catch (error) {
        logger.error('Error getting content type distribution:', error);
        throw error;
    }
}

// top 3 groups have most members
const getTop3GroupsMostMembers = async () => {
    try {
        const groups = await groupModel.aggregate([
            {
                $project: {
                    name: 1,
                    memberCount: { $size: "$members" }
                }
            },
            {
                $sort: { memberCount: -1 }
            },
            {
                $limit: 3
            }
        ]).exec();

        return groups.map(group => ({
            name: group.name,
            members: group.memberCount
        }));
    } catch (error) {
        logger.error('Error getting top 3 groups with most members:', error);
        throw error;
    }
}

// top 5 trending posts
const getTop5TrendingPosts = async () => {
    try {
        const trendingPosts = await postModel.aggregate([
            {
                $match: {
                    status: "public", // Only include public posts
                    content: { $exists: true, $ne: "" } // Only include posts with content
                }
            },
            {
                $project: {
                    title: "$content",
                    likesCount: { $size: "$likes" },
                    commentsCount: { $size: "$comments" },
                    totalInteractions: {
                        $add: [
                            { $size: "$likes" },
                            { $size: "$comments" }
                        ]
                    }
                }
            },
            {
                $sort: {
                    totalInteractions: -1
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    title: 1,
                    likes: "$likesCount", 
                    comments: "$commentsCount",
                    _id: 1
                }
            }
        ]).exec();

        return trendingPosts;
    } catch (error) {
        logger.error('Error getting top 5 trending posts:', error);
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
    unhidePostById,
    getDashboard,
    getMonthlyUserRegistrationTrend,
    getContentTypeMetrics,
    getTop3GroupsMostMembers,
    getTop5TrendingPosts
}