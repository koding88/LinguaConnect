const postModel = require('../models/post.Model');
const commentModel = require('../models/comment.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const {postValidation, updatePostValidation, postIdValidation, getPostValidation} = require("../validations/postValidation");
const {deleteImages} = require("../utils/cloudinaryUtil");

let projection = {group: 0}

const getAllPosts = async () => {
    try {
        // Retrieve all posts and populate user information
        const posts = await postModel.find({}, projection)
            .populate('user', 'username full_name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name'
                }
            })

        if (!posts) {
            throw errorHandler(404, 'No posts found');
        }

        logger.info(`Successfully retrieved ${posts.length} posts`);
        return posts;
    } catch (error) {
        // Log and rethrow the error
        logger.error(`Error getting all posts: ${error.message}`);
        throw error
    }
};


const getOnePost = async (postId) => {
    try {
        const {error} = getPostValidation({id: postId});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post by ID and populate user information
        const post = await postModel.findById(postId, projection)
            .populate('user', 'username full_name')
            .exec();

        // Handle case where post is not found
        if (!post) {
            throw errorHandler(404, 'No post found');
        }

        return post;
    } catch (error) {
        // Log and rethrow the error
        logger.error(`Error getting post: ${error.message}`);
        throw error
    }
};


const createPost = async (userId, postData) => {
    try {
        // Destructure content from postData
        const {content, images} = postData;

        // Validate the post data
        const {error} = postValidation({id: userId, content});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Create a new post instance
        const newPost = new postModel({
            content,
            images,
            user: userId
        });

        // Save the new post to the database
        await newPost.save();

        logger.info(`User ${userId} created post successfully`);

        return newPost;
    } catch (error) {
        // Log and rethrow any errors that occur
        logger.error(`Error creating post: ${error.message}`);
        throw error;
    }
};


const updatePost = async (postId, userId, updateData) => {
    try {
        // Validate the post ID and user ID
        const {error: idError} = postIdValidation({postId: postId, userId: userId});
        if (idError) {
            throw errorHandler(400, `Validation error: ${idError.message}`);
        }

        // Fetch the post from the database
        const existingPost = await postModel.findById(postId);
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check ownership of the comment
        if(existingPost.user.toString() !== userId) {
            throw errorHandler(403, 'You are not allowed to update comment');
        }

        // Destructure content, urls (for removal), and images from updateData
        const {content, urls, images} = updateData;

        // Validate the update data if necessary
        const {error: validationError} = updatePostValidation({content: content, urls: urls, images: images});
        if (validationError) {
            throw errorHandler(400, `Validation error: ${validationError.message}`);
        }

        // Use existing images from the post
        let currentImages = existingPost.images || [];

        // Handle URLs for removal only if urls is provided
        if (urls && Array.isArray(urls) && urls.length > 0) {
            const invalidUrls = urls.filter(url => !currentImages.includes(url));
            if (invalidUrls.length > 0) {
                throw errorHandler(400, `The following URLs do not exist in this post: ${invalidUrls.join(', ')}`);
            }

            // Delete the images
            const {deletedUrls, failedUrls} = await deleteImages(urls);
            if (failedUrls.length > 0) {
                throw errorHandler(500, 'Error deleting image');
            }

            // Remove deleted URLs from current images
            currentImages = currentImages.filter(url => !deletedUrls.includes(url));
        }

        // Handle adding new images only if images is provided
        if (images && Array.isArray(images) && images.length > 0) {
            currentImages = [...currentImages, ...images];
        }

        // Update content if provided
        if (content !== undefined) {
            existingPost.content = content;
        }

        // Update images
        existingPost.images = currentImages;

        // Save the updated post
        await existingPost.save();

        return existingPost;

    } catch (error) {
        logger.error(`Error updating post: ${error.message}`);
        throw error;
    }
};

const deletePost = async (postId, userId) => {
    try {
        // Validate the post ID and user ID
        const {error: idError} = postIdValidation({postId, userId});
        if (idError) {
            throw errorHandler(400, `Validation error: ${idError.message}`);
        }

        // Fetch the post by ID and populate user information
        const post = await postModel.findById(postId)

        // Handle case where post is not found
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Check ownership of the post
        if (post.user.toString() !== userId) {
            throw errorHandler(403, 'You are not allowed to delete post');
        }

        // Handle image deletion if the post has images
        if (post.images.length > 0) {
            const {deletedUrls, failedUrls} = await deleteImages(post.images);
            if (failedUrls.length > 0) {
                throw errorHandler(500, 'Error deleting image');
            }
        }

        // Delete comment references from the post
        await commentModel.deleteMany({post: postId}).exec();

        // Delete the post from the database
        await postModel.findByIdAndDelete(postId).exec();

        // Log successful deletion
        logger.info(`${post.user?.username || 'Unknown user'} deleted post successfully`);

        return {message: 'Post deleted successfully'};

    } catch (error) {
        // Log and rethrow the error
        logger.error(`Error deleting post: ${error.message}`);
        throw error;
    }
};

const likePost = async (postId, userId) => {
    try {
        // Validate the post ID and user ID
        const {error: idError} = postIdValidation({postId, userId});
        if (idError) {
            throw errorHandler(400, `Validation error: ${idError.message}`);
        }

        // Fetch the post by ID
        const post = await postModel.findById(postId);

        // Handle case where post is not found
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(userId);
        if (hasLiked) {
            // Remove like if the user has already liked the post
            post.likes.pull(userId);
        } else {
            // Add like
            post.likes.push(userId);
        }

        // Save the updated post
        await post.save();

        // Log successful like
        logger.info(`User ${userId} liked post ${postId} successfully`);

        return {message: 'Post liked successfully'};

    } catch (error) {
        // Log and rethrow the error
        logger.error(`Error liking post: ${error.message}`);
        throw error;
    }
}


module.exports = {getAllPosts, getOnePost, createPost, updatePost, deletePost, likePost}