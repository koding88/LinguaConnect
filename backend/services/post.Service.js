const postModel = require('../models/post.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const {idValidation, PostValidation, updatePostValidation} = require("../validations/postValidation");
const {deleteImages} = require("../utils/cloudinaryUtil");

const getAllPosts = async () => {
    try {
        // Retrieve all posts and populate user information
        const posts = await postModel.find()
            .populate('user', 'username full_name')
            .exec();

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
        const {error} = idValidation({id: postId});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post by ID and populate user information
        const post = await postModel.findById(postId)
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
        const {error} = PostValidation({id: userId, content});
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


const updatePost = async (postId, updateData) => {
    try {
        // Validate the post ID
        const { error: idError } = idValidation({ id: postId });
        if (idError) {
            throw errorHandler(400, `Validation error: ${idError.message}`);
        }

        // Fetch the post from the database
        const existingPost = await postModel.findById(postId);
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Destructure content, urlsToRemove, and newImages from updateData with default values
        const { content, urlsToRemove = [], newImages = [] } = updateData;

        // Validate the update data
        const { error: validationError } = updatePostValidation({ content, urlsToRemove, newImages });
        if (validationError) {
            throw errorHandler(400, `Validation error: ${validationError.message}`);
        }

        // Use existing images from the post
        let currentImages = existingPost.images;

        // Ensure that all URLs to be removed exist in the current post's images
        const invalidUrls = urlsToRemove.filter(url => !currentImages.includes(url));

        // If there are any invalid URLs (i.e., they do not exist in the post's images), throw an error
        if (invalidUrls.length > 0) {
            throw errorHandler(400, `The following URLs do not exist in this post: ${invalidUrls.join(', ')}`);
        }

        // If there are URLs to remove, handle image deletion
        if (urlsToRemove.length > 0) {
            const { deletedUrls, failedUrls } = await deleteImages(urlsToRemove);
            if (failedUrls.length > 0) {
                throw errorHandler(500, 'Error deleting image');
            }

            // Remove deleted URLs from existing post images
            currentImages = currentImages.filter(url => !deletedUrls.includes(url));
        }

        // Combine existing images (after deletions) with new images
        const updatedImages = [...currentImages, ...newImages];

        // Update post content and images
        if (content !== undefined) {
            existingPost.content = content;
        }
        existingPost.images = updatedImages;

        // Save the updated post
        await existingPost.save();

        return existingPost;

    } catch (error) {
        logger.error(`Error updating post: ${error.message}`);
        throw error;
    }
};





const deletePost = async (postId) => {
    try {
        // Validate the post ID
        const {error} = idValidation({id: postId});
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Fetch the post by ID and populate user information
        const post = await postModel.findById(postId).populate('user', 'username full_name').exec();

        // Handle case where post is not found
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Handle image deletion if the post has images
        if (post.images.length > 0) {
            const {deletedUrls, failedUrls} = await deleteImages(post.images);
            if (failedUrls.length > 0) {
                throw errorHandler(500, 'Error deleting image');
            }
        }

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


module.exports = {getAllPosts, getOnePost, createPost, updatePost, deletePost}