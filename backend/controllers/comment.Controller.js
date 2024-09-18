const commentService = require('../services/comment.Service');

const createCommentController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;
        const {content} = req.body;

        const comment = await commentService.createComment(userId, postId, {content});

        res.status(201).json({
            status: 'success',
            message: 'Comment created successfully',
            data: comment,
        });
    } catch (error) {
        next(error);
    }
}

const updateCommentController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const commentId = req.params.id;
        const {content, postId} = req.body;

        const comment = await commentService.updateComment(userId, postId, commentId, {content});

        res.status(200).json({
            status: 'success',
            message: 'Comment updated successfully',
            data: comment,
        });
    } catch (error) {
        next(error);
    }
}

const deleteCommentController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const commentId = req.params.id;
        const {postId} = req.body;

        console.log(userId, postId, commentId);

        await commentService.deleteComment(userId, postId, commentId);

        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCommentController,
    updateCommentController,
    deleteCommentController
}