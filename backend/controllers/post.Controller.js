const postService = require('../services/post.Service');

const getAllPostsController = async (req, res, next) => {
    try {
        const posts = await postService.getAllPosts();

        res.status(200).json({
            status: 'success',
            message: 'Posts fetched successfully',
            data: posts,
        });
    } catch (error) {
        next(error);
    }
}

const getPostByIdController = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await postService.getOnePost(postId);

        res.status(200).json({
            status: 'success',
            message: 'Post fetched successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

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

const updatePostController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        const { content, urls } = req.body;

        // Initialize images to an empty array if not provided
        const images = req.fileUrls || [];

        // Ensure urls is always an array and filter out any undefined values
        const normalizedUrls = Array.isArray(urls) ? urls.filter(url => url) : [urls].filter(url => url);

        // Prepare the post data for update, only include fields that are provided
        const postData = {
            ...(content !== undefined && { content }),
            ...(normalizedUrls.length > 0 && { urls: normalizedUrls }),
            ...(images.length > 0 && { images }),
        };

        const post = await postService.updatePost(postId, userId, postData);

        res.status(200).json({
            status: 'success',
            message: 'Post updated successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
};




const deletePostController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        await postService.deletePost(postId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllPostsController,
    getPostByIdController,
    createPostController,
    updatePostController,
    deletePostController
}