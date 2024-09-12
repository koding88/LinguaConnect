const postModel = require('../models/post.Model');
const userModel = require('../models/user.Model');
const postService = require('../services/post.Service');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');

const createPostController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {content} = req.body;
        const images = req.fileUrls;

        const post = await postService.createPost(userId, {content, images});

        res.status(201).json({
            status: 'success',
            message: 'Post created successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {createPostController}