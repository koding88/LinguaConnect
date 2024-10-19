const postModel = require('../models/post.Model');
const commentModel = require('../models/comment.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const {
    createCommentValidation,
    updateCommentValidation,
    likeAndDeleteCommentValidation
} = require("../validations/commentValidation");

const createComment = async (userId, postId, commentData) => {
    try {
        // Validate the comment data
        const {error} = createCommentValidation({userId: userId, postId: postId, content: commentData.content});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post
        const post = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        }).populate({
            path: 'user',
            select: 'username full_name avatarUrl'
        }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        })

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

        const postInfo = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        }).populate({
            path: 'user',
            select: 'username full_name avatarUrl location'
        }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        })

        return postInfo;

    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error creating comment: ${error.message}`);
        throw error;
    }
};

const updateComment = async (userId, postId, commentId, commentData) => {
    try {
        // Validate the comment data
        const {error} = updateCommentValidation({
            userId: userId,
            postId: postId,
            commentId: commentId,
            content: commentData.content
        });
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post
        const post = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        });

        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Find the comment
        const comment = await commentModel.findByIdAndUpdate(commentId, commentData, {new: true});
        if (!comment) {
            throw errorHandler(404, 'Comment not found');
        }

        // Check ownership of the comment
        if (comment.user.toString() !== userId) {
            throw errorHandler(403, 'You are not allowed to modify comment');
        }

        logger.info(`User ${userId} updated comment in ${postId} successfully`);
        const postInfo = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        }).populate({
            path: 'user',
            select: 'username full_name avatarUrl location'
        }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        })

        return postInfo;

    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error updating comment: ${error.message}`);
        throw error;
    }
}

const deleteComment = async (userId, postId, commentId) => {
    try {
        // Validate the comment data
        const {error} = likeAndDeleteCommentValidation({userId: userId, postId: postId, commentId: commentId});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post
        const post = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        });

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

        const postInfo = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        }).populate({
            path: 'user',
            select: 'username full_name avatarUrl location'
        }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        })

        return postInfo;

    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error deleting comment: ${error.message}`);
        throw error;
    }
}

const likeComment = async (userId, postId, commentId) => {
    try {
        // Validate the comment data
        const {error} = likeAndDeleteCommentValidation({userId: userId, postId: postId, commentId: commentId});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post
        const post = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        }).populate({
            path: 'user',
            select: 'username full_name avatarUrl location'
        }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        })

        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Find the comment
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            throw errorHandler(404, 'Comment not found');
        }

        // Check if the user has already liked the comment
        const hashComment = comment.likes.includes(userId);
        if (hashComment) {
            // Remove like if the user has already liked the post
            comment.likes.pull(userId);
        } else {
            // Add like
            comment.likes.push(userId);
        }

        await comment.save();

        logger.info(`User ${userId} liked comment in ${postId} successfully`);

        // Find the post
        const postInfo = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        }).populate({
            path: 'user',
            select: 'username full_name avatarUrl location'
        }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        })

        return postInfo;
    } catch (error) {
        // Log the error and rethrow it
        logger.error(`Error liking comment: ${error.message}`);
        throw error;
    }
}

module.exports = {
    createComment, updateComment, deleteComment, likeComment
};
