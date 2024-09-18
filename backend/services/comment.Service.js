const postModel = require('../models/post.Model');
const commentModel = require('../models/comment.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const {createCommentValidation, updateCommentValidation, deleteCommentValidation} = require("../validations/commentValidation");

const createComment = async (userId, postId, commentData) => {
    try {
        // Validate the comment data
        const {error} = createCommentValidation({userId: userId, postId: postId, content: commentData.content});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Create the new comment
        const newComment = new commentModel({
            ...commentData,
            user: userId,
            post: postId,
            postOwner: post.user
        });

        // Save the new comment
        await newComment.save();

        // Update the post with the new comment
        post.comments.push(newComment._id);
        await post.save();

        logger.info(`User ${userId} created comment in ${postId} successfully`);

        return newComment;

    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error creating comment: ${error.message}`);
        throw error;
    }
};

const updateComment = async (userId, postId, commentId, commentData) => {
    try {
        // Validate the comment data
        const {error} = updateCommentValidation({userId: userId, postId: postId, commentId: commentId, content: commentData.content});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Find the comment
        const comment = await commentModel.findByIdAndUpdate(commentId, commentData, {new: true});
        if (!comment) {
            throw errorHandler(404, 'Comment not found');
        }

        logger.info(`User ${userId} updated comment in ${postId} successfully`);
        return comment;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating comment: ${error.message}`);
        throw error;
    }
}

const deleteComment = async (userId, postId, commentId) => {
    try {
        // Validate the comment data
        const {error} = deleteCommentValidation({userId: userId, postId: postId, commentId: commentId});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Find the comment
        const comment = await commentModel.findByIdAndDelete(commentId);
        if (!comment) {
            throw errorHandler(404, 'Comment not found');
        }

        // Remove the comment from the post
        post.comments = post.comments.filter(comment => comment.toString() !== commentId);
        await post.save();

        logger.info(`User ${userId} deleted comment in ${postId} successfully`);
        return {message: 'Comment deleted successfully'};
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error deleting comment: ${error.message}`);
        throw error;
    }
}

module.exports = {
    createComment, updateComment, deleteComment
};

