const postModel = require('../models/post.Model');
const commentModel = require('../models/comment.Model');
const userModel = require('../models/user.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const { postValidation, updatePostValidation, postIdValidation, getPostValidation } = require("../validations/postValidation");
const { deleteImages } = require("../utils/cloudinaryUtil");
const notificationModel = require('../models/notification.Model');
const { getReceiverSocketId, io } = require("../sockets/sockets");

let projection = { group: 0 }

const getAllPosts = async () => {
    try {
        const currentTime = new Date();
        const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);

        // Retrieve recent posts within the last 30 minutes
        const recentPosts = await postModel.find({
            status: 'public',
            group: null,
            createdAt: { $gte: thirtyMinutesAgo }
        }, projection)
            .populate('user', 'username full_name avatarUrl location')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })
            .sort({ createdAt: -1 });

        // Retrieve all other posts randomly
        const otherPosts = await postModel.aggregate([
            { $match: { status: 'public', group: null, createdAt: { $lt: thirtyMinutesAgo } } },
            { $sample: { size: 50 } } // Adjust the size as needed
        ]);

        // Populate user and comments for other posts
        await postModel.populate(otherPosts, {
            path: 'user',
            select: 'username full_name avatarUrl location'
        });
        await postModel.populate(otherPosts, {
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        });

        const allPosts = [...recentPosts, ...otherPosts];

        if (allPosts.length === 0) {
            return [];
        }

        logger.info(`Successfully retrieved ${allPosts.length} public posts`);
        return allPosts;
    } catch (error) {
        logger.error(`Error getting public posts: ${error.message}`);
        throw error;
    }
};


const getOnePost = async (postId) => {
    try {
        const { error } = getPostValidation({ id: postId });
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Find the post by ID and populate user information
        const post = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        }, projection)
            .populate('user', 'username full_name avatarUrl location')
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'user', select: 'username full_name avatarUrl location'
                }
            })
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
        // Destructure content and images from postData
        const { content, images } = postData;

        // Check if post has either content or images
        if (!content && (!images || images.length === 0)) {
            throw errorHandler(400, 'Post must have either content or at least one image');
        }

        // Validate the post data if content exists
        if (content) {
            const { error } = postValidation({ id: userId, content });
            if (error) {
                throw errorHandler(400, `Validation error: ${error.message}`);
            }
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
        const { error: idError } = postIdValidation({ postId: postId, userId: userId });
        if (idError) {
            throw errorHandler(400, `Validation error: ${idError.message}`);
        }

        // Fetch the post from the database
        const existingPost = await postModel.findById(postId);
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check ownership of the comment
        if (existingPost.user.toString() !== userId) {
            throw errorHandler(403, 'You are not allowed to update comment');
        }

        // Destructure content, urls (for removal), and images from updateData
        const { content, urls, images } = updateData;

        // Validate the update data if necessary
        const { error: validationError } = updatePostValidation({ content: content, urls: urls, images: images });
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
            const { deletedUrls, failedUrls } = await deleteImages(urls);
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

        // Check if post has either content or images after updates
        if (!content && currentImages.length === 0) {
            throw errorHandler(400, 'Post must have either content or at least one image');
        }

        // Update content
        existingPost.content = content || '';

        // Update images
        existingPost.images = currentImages;

        // Save the updated post
        await existingPost.save();

        logger.info(`Successfully ${userId} updated post ${postId}`);

        return existingPost;

    } catch (error) {
        logger.error(`Error updating post: ${error.message}`);
        throw error;
    }
};

const deletePost = async (postId, userId) => {
    try {
        // Validate the post ID and user ID
        const { error: idError } = postIdValidation({ postId, userId });
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
            const { deletedUrls, failedUrls } = await deleteImages(post.images);
            if (failedUrls.length > 0) {
                throw errorHandler(500, 'Error deleting image');
            }
        }

        // Delete comment references from the post
        await commentModel.deleteMany({ post: postId }).exec();

        // Delete the post from the database
        await postModel.findByIdAndDelete(postId).exec();

        // Log successful deletion
        logger.info(`User ${userId} deleted post successfully`);

        return { message: 'Post deleted successfully' };

    } catch (error) {
        // Log and rethrow the error
        logger.error(`Error deleting post: ${error.message}`);
        throw error;
    }
};

const likePost = async (postId, userId) => {
    try {
        const post = await postModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }

        // Check if user already liked the post
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike post
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        } else {
            // Like post and create notification (only if the post owner is not the same as liker)
            if (post.user.toString() !== userId) {
                post.likes.push(userId);

                // Create notification
                await notificationModel.create({
                    user: userId,
                    recipients: [post.user],
                    content: `liked your post "${post.content}"`,
                    type: "post_like",
                    url: `/post/${postId}`,
                });

                // emit
                const receiverSocketId = getReceiverSocketId(post.user.toString())
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification")
                }
            } else {
                post.likes.push(userId);
            }
        }

        await post.save();
        return post;
    } catch (error) {
        throw error;
    }
};

const reportPost = async (postId, userId) => {
    try {
        // Validate the post ID and user ID
        const { error: idError } = postIdValidation({ postId, userId });
        if (idError) {
            throw errorHandler(400, `Validation error: ${idError.message}`);
        }

        // Fetch the post by ID
        const post = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: null
        });

        // Handle case where post is not found
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the user has already reported the post
        const hasReported = post.report.includes(userId);
        if (hasReported) {
            throw errorHandler(400, 'You have already reported this post');
        }

        // Add the user to the report array
        post.report.push(userId);

        // Create notification for admins
        const admins = await userModel.find({ role: 'admin' });
        await notificationModel.create({
            user: userId,
            recipients: admins.map(admin => admin._id),
            content: `reported a post "${post.content}"`,
            type: "admin_post_report",
            url: `/admin/manage/posts/${postId}`,
        });

        // Emit socket event to all admins
        admins.forEach(admin => {
            const receiverSocketId = getReceiverSocketId(admin._id.toString())
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("admin-notification")
            }
        });

        // Save the updated post
        await post.save();

        logger.info(`User ${userId} reported post ${postId} successfully`);

        return post;

    } catch (error) {
        logger.error(`Error reporting post: ${error.message}`);
        throw error;
    }
}

const filterPostByFollowing = async (userId) => {
    try {
        // Get user's following list
        const user = await userModel.findById(userId).select('following');
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Find posts from users that the current user follows
        const posts = await postModel.find({
            user: { $in: user.following },
            status: 'public',
            group: null
        }, projection)
        .sort({ createdAt: -1 })
        .populate('user', 'username full_name avatarUrl location')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        });

        return posts;

    } catch (error) {
        logger.error(`Error filtering posts: ${error.message}`);
        throw error;
    }
}

const filterPostByLikes = async (userId) => {
    try {
        // Get user
        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Find posts that have this user's ID in their likes array
        const posts = await postModel.find({
            likes: userId,
            status: 'public',
            group: null
        }, projection)
        .sort({ createdAt: -1 })
        .populate('user', 'username full_name avatarUrl location')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username full_name avatarUrl location'
            }
        });

        return posts;

    } catch (error) {
        logger.error(`Error filtering posts: ${error.message}`);
        throw error;
    }
}

const filterPostByComments = async (userId) => {
    try {
        // Get user
        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Find all comments by this user
        const userComments = await commentModel.find({ user: userId });
        
        // Get unique post IDs from the comments
        const postIds = [...new Set(userComments.map(comment => comment.post))];

        // Find those posts
        const posts = await postModel.find({
            _id: { $in: postIds },
            status: 'public',
            group: null
        })
        .sort({ createdAt: -1 })
        .populate('user', 'username avatarUrl')
        .populate('likes', 'username avatarUrl location')
        .populate('comments.user', 'username avatarUrl location');

        return posts;

    } catch (error) {
        logger.error(`Error filtering posts by comments: ${error.message}`);
        throw error;
    }
}



module.exports = { 
    getAllPosts, 
    getOnePost, 
    createPost, 
    updatePost, 
    deletePost, 
    likePost, 
    reportPost, 
    filterPostByFollowing,
    filterPostByLikes,
    filterPostByComments
}