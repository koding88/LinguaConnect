const adminService = require('../services/admin.Service');
const topicService = require('../services/topic.Service');

const getAllUsersController = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

const getUserByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await adminService.getUserById(id);
        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const lockUserByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await adminService.lockUserById(id);
        res.status(200).json({
            status: 'success',
            message: 'User locked successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const unlockUserByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await adminService.unlockUserById(id);
        res.status(200).json({
            status: 'success',
            message: 'User unlocked successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

const searchAccountController = async (req, res, next) => {
    try {
        const { key } = req.query;
        const user = await adminService.searchAccount(key);
        res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const getAllGroupsController = async (req, res, next) => {
    try {
        const groups = await adminService.getAllGroups();
        res.status(200).json({
            status: 'success',
            message: 'Groups retrieved successfully',
            data: groups,
        });
    } catch (error) {
        next(error);
    }
}

const getGroupByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const group = await adminService.getGroupById(id);
        res.status(200).json({
            status: 'success',
            message: 'Group retrieved successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const blockGroupByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const group = await adminService.blockGroupById(id);
        res.status(200).json({
            status: 'success',
            message: 'Group blocked successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const unblockGroupByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const group = await adminService.unblockGroupById(id);
        res.status(200).json({
            status: 'success',
            message: 'Group unblocked successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const getAllPostsController = async (req, res, next) => {
    try {
        const posts = await adminService.getAllPosts();
        res.status(200).json({
            status: 'success',
            message: 'Posts retrieved successfully',
            data: posts,
        });
    } catch (error) {
        next(error);
    }
}

const getPostByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const post = await adminService.getPostById(id);
        res.status(200).json({
            status: 'success',
            message: 'Post retrieved successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

const hidePostByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const post = await adminService.hidePostById(id);
        res.status(200).json({
            status: 'success',
            message: 'Post hidden successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

const unhidePostByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const post = await adminService.unhidePostById(id);
        res.status(200).json({
            status: 'success',
            message: 'Post unhidden successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

const getAllTopicsController = async (req, res, next) => {
    try {
        const topics = await topicService.getAllTopics();
        res.status(200).json({
            status: 'success',
            message: 'Topics retrieved successfully',
            data: topics,
        });
    } catch (error) {
        next(error);
    }
}

const getTopicByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const topic = await topicService.getTopicById(id);
        res.status(200).json({
            status: 'success',
            message: 'Topic retrieved successfully',
            data: topic,
        });
    } catch (error) {
        next(error);
    }
}

const createTopicController = async (req, res, next) => {
    try {
        const topic = await topicService.createTopic(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Topic created successfully',
            data: topic,
        });
    } catch (error) {
        next(error);
    }
}

const updateTopicByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const topic = await topicService.updateTopicById(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Topic updated successfully',
            data: topic,
        });
    } catch (error) {
        next(error);
    }
}

const deleteTopicByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const topic = await topicService.deleteTopicById(id);
        res.status(200).json({
            status: 'success',
            message: 'Topic deleted successfully',
            data: topic,
        });
    } catch (error) {
        next(error);
    }
}

const getDashboardController = async (req, res, next) => {
    try {
        const dashboard = await adminService.getDashboard();
        res.status(200).json({
            status: 'success',
            message: 'Dashboard retrieved successfully',
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
}

const getMonthlyUserRegistrationTrendController = async (req, res, next) => {
    try {
        const monthlyUserRegistrationTrend = await adminService.getMonthlyUserRegistrationTrend();
        res.status(200).json({
            status: 'success',
            message: 'Monthly user registration trend retrieved successfully',
            data: monthlyUserRegistrationTrend,
        });
    } catch (error) {
        next(error);
    }
}

const getContentTypeMetricsController = async (req, res, next) => {
    try {
        const contentTypeMetrics = await adminService.getContentTypeMetrics();
        res.status(200).json({
            status: 'success',
            message: 'Content type metrics retrieved successfully',
            data: contentTypeMetrics,
        });
    } catch (error) {
        next(error);
    }
}

const getTop3GroupsMostMembersController = async (req, res, next) => {
    try {
        const top3GroupsMostMembers = await adminService.getTop3GroupsMostMembers();
        res.status(200).json({
            status: 'success',
            message: 'Top 3 groups most members retrieved successfully',
            data: top3GroupsMostMembers,
        });
    } catch (error) {
        next(error);
    }
}

const getTop5TrendingPostsController = async (req, res, next) => {
    try {
        const top5TrendingPosts = await adminService.getTop5TrendingPosts();
        res.status(200).json({
            status: 'success',
            message: 'Top 5 trending posts retrieved successfully',
            data: top5TrendingPosts,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsersController,
    getUserByIdController,
    lockUserByIdController,
    unlockUserByIdController,
    searchAccountController,
    getAllGroupsController,
    getGroupByIdController,
    blockGroupByIdController,
    unblockGroupByIdController,
    getAllPostsController,
    getPostByIdController,
    hidePostByIdController,
    unhidePostByIdController,
    getAllTopicsController,
    getTopicByIdController,
    createTopicController,
    updateTopicByIdController,
    deleteTopicByIdController,
    getDashboardController,
    getMonthlyUserRegistrationTrendController,
    getContentTypeMetricsController,
    getTop3GroupsMostMembersController,
    getTop5TrendingPostsController
}
