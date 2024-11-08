const groupModel = require('../models/group.Model');
const userModel = require('../models/user.Model');
const postModel = require('../models/post.Model');
const commentModel = require('../models/comment.Model');
const errorHandler = require('../utils/errorUtil');
const logger = require('../utils/loggerUtil');
const { deleteImages } = require("../utils/cloudinaryUtil");
const { getReceiverSocketId, io } = require('../sockets/sockets');
const notificationModel = require('../models/notification.Model');

const {
    idValidation,
    getOneGroupValidation,
    createGroupValidation,
    updateGroupValidation,
    deleteGroupValidation,
    removeGroupMemberValidation,
    joinGroupValidation,
    leaveGroupValidation,
    limitGroupMembersValidation,
    getAllPostsInGroupValidation, createPostInGroupValidation, postInGroupValidation, updatePostInGroupValidation,
    commentInGroupValidation,
    updateCommentInGroupValidation,
    likeAndDeleteCommentInGroupValidation
} = require("../validations/groupValidation");

const getAllGroups = async () => {
    try {
        const groups = await groupModel.find({ status: 'active' })
            .populate('owner', 'username full_name')
            .populate('members', 'username full_name')
            .exec();

        if (!groups) {
            throw errorHandler(404, 'No groups found');
        }

        logger.info(`Successfully retrieved ${groups.length} groups`);
        return groups;
    } catch (error) {
        logger.error(`Error getting all groups: ${error.message}`);
        throw error
    }
}

const getOneGroup = async (groupId) => {
    try {
        const { error } = getOneGroupValidation({ groupId });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        const group = await groupModel.findOne({ _id: groupId })
            .populate('owner', 'username full_name avatarUrl')
            .populate('members', 'username full_name avatarUrl')
            .exec();

        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (!group) {
            throw errorHandler(404, 'No group found');
        }

        return group;
    } catch (error) {
        logger.error(`Error getting group: ${error.message}`);
        throw error;
    }
}

const searchGroups = async (searchTerm) => {
    try {
        const groups = await groupModel.find({ name: { $regex: searchTerm, $options: 'i' } });

        if (!groups || groups.length === 0) {
            throw errorHandler(404, 'No groups found matching search term');
        }

        return groups;
    } catch (error) {
        logger.error(`Error searching groups: ${error.message}`);
        throw error;
    }
}

const createGroup = async (groupData) => {
    try {
        // Destructure the input data
        const { name, description, userId: ownerId } = groupData;

        // Validate the input data
        const { error } = createGroupValidation({ name, description, userId: ownerId });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        // Check if the owner exists
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Check for existing group
        const existingGroup = await groupModel.findOne({ name });
        if (existingGroup) {
            throw errorHandler(409, 'Group already exists');
        }

        // Create a new group
        const group = new groupModel({
            name,
            description,
            owner: ownerId,
            members: [ownerId],
        });

        // Create notification for admins
        const admins = await userModel.find({ role: 'admin' });
        await notificationModel.create({
            user: ownerId,
            recipients: admins.map(admin => admin._id),
            content: `created a new group "${name}"`,
            type: "admin_group_created",
            url: `/admin/manage/groups`,
        });

        // Emit socket event to all admins
        admins.forEach(admin => {
            const receiverSocketId = getReceiverSocketId(admin._id.toString())
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("admin-notification")
            }
        });

        // Save the group
        await group.save();

        return group;
    } catch (error) {
        logger.error(`Error creating group: ${error.message}`);
        throw error;
    }
};

const updateGroup = async (groupId, ownerId, groupData) => {
    try {
        // Validate the group ID
        const { error: groupError } = idValidation({ id: groupId });
        if (groupError) {
            throw errorHandler(400, `Invalid validation error: ${groupError.message}`);
        }
        // Validate the ownerId
        const { error: ownerError } = idValidation({ id: ownerId });
        if (ownerError) {
            throw errorHandler(400, `Invalid validation error: ${ownerError.message}`);
        }

        // Check if the owner exists
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Check if the owner has permission to edit the group
        const group = await groupModel.findOne({ _id: groupId, owner: ownerId });
        if (!group) {
            throw errorHandler(403, 'Access denied');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        // Destructure the new group data
        const { name, description } = groupData;

        // Validate the new group data
        const { error } = updateGroupValidation({ name, description });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        // Check for an existing group with the same name
        const existingGroup = await groupModel.findOne({ name });
        if (existingGroup && existingGroup._id.toString() !== groupId) {
            throw errorHandler(409, 'Group already exists');
        }

        // Update the group
        const updatedGroup = await groupModel.findOneAndUpdate(
            { _id: groupId },
            { name, description },
            { new: true }
        );

        return updatedGroup;
    } catch (error) {
        logger.error(`Error updating group: ${error.message}`);
        throw error;
    }
};


const deleteGroup = async (groupId, ownerId) => {
    try {
        // Validate the group ID and owner ID
        const { error: groupError } = deleteGroupValidation({ userId: ownerId, groupId });
        if (groupError) {
            throw errorHandler(400, `Invalid validation error: ${groupError.message}`);
        }

        // Check if the owner exists
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Check if the group exists
        const groupExists = await groupModel.findById(groupId);
        if (!groupExists) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the owner has permission to delete the group
        const group = await groupModel.findOne({ _id: groupId, owner: ownerId });
        if (!group) {
            throw errorHandler(403, 'Access denied');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        // Delete all posts in the group
        await postModel.deleteMany({ group: groupId });

        // Delete all comments in the group
        await commentModel.deleteMany({ group: groupId });

        // Delete the group
        await groupModel.deleteOne({ _id: groupId });

        return { message: 'Group deleted successfully' };
    } catch (error) {
        logger.error(`Error deleting group: ${error.message}`);
        throw error;
    }
}

const limitGroupMembers = async (groupId, userId, maxMembers) => {
    try {
        // Validate the group ID and owner ID
        const { error } = limitGroupMembersValidation({ userId, groupId, maxMembers });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        // Check if the group exists
        const group = await groupModel.findById(groupId);
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        // Check if the owner exists
        const owner = await userModel.findById(userId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Verify the owner has permission to limit the group's members
        const groupOwnedByUser = await groupModel.findOne({ _id: groupId, owner: userId });
        if (!groupOwnedByUser) {
            throw errorHandler(403, 'Access denied');
        }

        // Update the maximum number of members allowed in the group
        await groupModel.updateOne({ _id: groupId }, { $set: { maxMembers } });

        return group
    } catch (error) {
        logger.error(`Error limiting group members: ${error.message}`);
        throw error;
    }
};

const removeGroupMember = async (groupId, ownerId, memberId) => {
    try {
        // Validate the group ID, owner ID, and member ID
        const { error } = removeGroupMemberValidation({ userId: ownerId, groupId, memberId });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        // Check if the group exists
        const group = await groupModel.findById(groupId);
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Validate the owner exists
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Verify the owner has permission to remove a member
        const ownerOfGroup = await groupModel.findOne({ _id: groupId, owner: ownerId });
        if (!ownerOfGroup) {
            throw errorHandler(403, 'Access denied');
        }

        // Check if the member exists
        const member = await userModel.findById(memberId);
        if (!member) {
            throw errorHandler(404, 'Member not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        // Check owner == member
        const isOwner = await groupModel.findOne({ _id: groupId, owner: memberId });
        if (isOwner) {
            throw errorHandler(403, 'Owner cannot be removed from group');
        }

        // Check if the member is part of the group
        const isMemberOfGroup = await groupModel.findOne({ _id: groupId, members: memberId });
        if (!isMemberOfGroup) {
            throw errorHandler(409, 'Member is not a member of the group');
        }

        // Remove the member from the group
        await groupModel.updateOne({ _id: groupId }, { $pull: { members: memberId } });

        return { message: 'Member removed successfully' };
    } catch (error) {
        logger.error(`Error removing member: ${error.message}`);
        throw error;
    }
};


const joinGroup = async (groupId, userId) => {
    try {
        // Validate the group ID and user ID
        const { error } = joinGroupValidation({ userId, groupId });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        // Validate the user
        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Check if the user is already a member of the group
        const existingMembership = await groupModel.findOne({ _id: groupId, members: userId });
        if (existingMembership) {
            throw errorHandler(409, 'User is already a member of the group');
        }

        // Retrieve the group data to check the member limit
        const group = await groupModel.findById(groupId);
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        // Check if the group has reached the maximum number of members
        if (group.members.length >= group.maxMembers) {
            throw errorHandler(403, 'Group has reached maximum number of members');
        }

        // Add the user to the group
        await groupModel.updateOne({ _id: groupId }, { $push: { members: userId } });

        // Create notification for group owner
        await notificationModel.create({
            user: userId,
            recipients: [group.owner],
            content: `joined your group "${group.name}"`,
            type: "group_join",
            url: `/group/${groupId}`,
        });

        // Add socket emit for real-time notification
        const receiverSocketId = getReceiverSocketId(group.owner.toString())
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification")
        }

        const updatedGroup = await groupModel.findById(groupId);

        return updatedGroup;
    } catch (error) {
        logger.error(`Error joining group: ${error.message}`);
        throw error;
    }
};


const leaveGroup = async (groupId, userId) => {
    try {
        // Validate the group ID and user ID
        const { error } = leaveGroupValidation({ userId, groupId });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        // Check if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Find the group first
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if user is the owner
        if (group.owner.toString() === userId) {
            throw errorHandler(403, 'Owner cannot leave group');
        }

        // Check if the group is blocked
        if (group.status !== 'active') {
            throw errorHandler(403, 'Group is blocked');
        }

        // Check if user is a member of the group
        if (!group.members.includes(userId)) {
            throw errorHandler(403, 'User is not a member of this group');
        }

        // Check if the user is a member of the group
        const membership = await groupModel.findOne({ _id: groupId, members: userId });
        if (!membership) {
            throw errorHandler(409, 'User is not a member of the group');
        }

        // Remove the user from the group
        await groupModel.updateOne({ _id: groupId }, { $pull: { members: userId } });

        return { message: 'User left group successfully' };
    } catch (error) {
        logger.error(`Error leaving group: ${error.message}`);
        throw error;
    }
};

const updateAvatarGroup = async (groupId, userId, avatar) => {
    try {
        // Validate inputs
        const { error: groupIdError } = idValidation({ id: groupId });
        if (groupIdError) {
            throw errorHandler(400, `Invalid group ID: ${groupIdError.message}`);
        }

        const { error: userIdError } = idValidation({ id: userId });
        if (userIdError) {
            throw errorHandler(400, `Invalid user ID: ${userIdError.message}`);
        }

        if (!avatar) {
            throw errorHandler(400, 'Avatar URL is required');
        }

        // Check if the group exists and get current data
        const group = await groupModel.findById(groupId);
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        if (group.status !== 'active') {
            throw errorHandler(403, 'Group is blocked');
        }

        // Check if the user is the owner of the group
        if (group.owner.toString() !== userId) {
            throw errorHandler(403, 'User is not the owner of the group');
        }

        // Delete old avatar from cloud storage if it exists
        if (group.avatarUrl) {
            await deleteImages([group.avatarUrl]);
        }

        // Update the avatar and return updated group
        const updatedGroup = await groupModel.findByIdAndUpdate(
            groupId,
            { $set: { avatarUrl: avatar } },
            { new: true }
        );

        logger.info(`Successfully updated avatar for group ${groupId}`);
        return updatedGroup;

    } catch (error) {
        logger.error(`Error updating avatar group: ${error.message}`);
        throw error;
    }
}

const getAllPostsInGroup = async (groupId, userId) => {
    try {
        // Validate groupId
        const { error } = getAllPostsInGroupValidation({ groupId });
        if (error) {
            throw errorHandler(400, `Invalid group ID: ${error.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        const posts = await postModel.find({ group: groupId, status: 'public' })
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })

        if (posts.length === 0) {
            return { posts: [] };
        }

        logger.info(`Successfully retrieved ${posts.length} posts in group ${groupId}`);

        return { posts };
    } catch (error) {
        logger.error(`Error getting all posts in group: ${error.message}`);
        throw error;
    }
}

const getPostInGroup = async (groupId, postId, userId) => {
    try {
        // Validate groupId, postId, userId
        const { error } = postInGroupValidation({ groupId: groupId, postId: postId, userId: userId });
        if (error) {
            throw errorHandler(400, `Invalid group ID: ${error.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        const post = await postModel.findOne({ _id: postId, status: 'public', group: groupId })
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })
        if (!post) {
            throw errorHandler(404, 'Post not found');
        }

        if (post.group.toString() !== groupId) {
            throw errorHandler(409, 'Post does not belong to the specified group');
        }

        logger.info(`Successfully retrieved post ${postId} in group ${groupId}`);
        return post;
    } catch (error) {
        logger.error(`Error getting post in group: ${error.message}`);
        throw error;
    }
}

const createPostInGroup = async (groupId, userId, postData) => {
    try {
        // Destructure the post data
        const { content, images } = postData;

        // Validate the group ID and user ID
        const { error } = createPostInGroupValidation({ userId, groupId, content });
        if (error) {
            throw errorHandler(400, `Invalid validation error: ${error.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Create a new post
        const newPost = new postModel({
            content,
            images,
            user: userId,
            group: groupId
        });

        // Save the new post to the database
        await newPost.save();

        // Add the post to the group
        await groupModel.updateOne({ _id: groupId }, { $push: { posts: newPost._id } });

        logger.info(`Successfully ${userId} created post in group ${groupId}`);

        return newPost;
    } catch (error) {
        logger.error(`Error creating post in group: ${error.message}`);
        throw error;
    }
}

const updatePostInGroup = async (groupId, userId, postId, postData) => {
    try {
        // Validate groupId, userId, postId
        const { error: idError } = postInGroupValidation({ groupId: groupId, userId: userId, postId: postId });
        if (idError) {
            throw errorHandler(400, `Invalid group ID: ${idError.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: groupId
        });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the user is the owner of the post
        if (existingPost.user.toString() !== userId) {
            throw errorHandler(403, 'User is not the owner of the post');
        }

        // Destructure content, urls (for removal), and images from postData
        const { content, urls, images } = postData;

        // Validate the update data if necessary
        const { error: validationError } = updatePostInGroupValidation({ content: content, urls: urls, images: images });
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
                logger.error(`Failed to delete images: ${failedUrls.join(', ')}`);
                throw errorHandler(500, 'Some images could not be deleted. Please try again.');
            }

            // Remove deleted URLs from current images only if deletion was successful
            if (deletedUrls.length > 0) {
                currentImages = currentImages.filter(url => !deletedUrls.includes(url));
            }
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

        // Update the group with the new post
        await groupModel.updateOne({ _id: groupId }, { $push: { posts: existingPost._id } });

        const updatedPost = await postModel.findById(postId)
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })

        logger.info(`Successfully ${userId} updated post in group ${groupId}`);

        return updatedPost;

    } catch (error) {
        logger.error(`Error updating post in group: ${error.message}`);
        throw error;
    }
}

const deletePostInGroup = async (groupId, userId, postId) => {
    try {
        // Validate groupId, userId, postId
        const { error: idError } = postInGroupValidation({ groupId: groupId, userId: userId, postId: postId });
        if (idError) {
            throw errorHandler(400, `Invalid group ID: ${idError.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: groupId
        });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the user is the owner of the post
        if (existingPost.user.toString() !== userId) {
            throw errorHandler(403, 'User is not the owner of the post');
        }

        // Handle image deletion if the post has images
        if (existingPost.images.length > 0) {
            const { deletedUrls, failedUrls } = await deleteImages(existingPost.images);
            if (failedUrls.length > 0) {
                throw errorHandler(500, 'Error deleting image');
            }
        }

        // Delete comment references from the post
        await commentModel.deleteMany({ post: postId }).exec();

        // Delete the post
        await postModel.findByIdAndDelete(postId).exec();

        // Remove the post from the group
        await groupModel.updateOne({ _id: groupId }, { $pull: { posts: postId } });

        // Log successful deletion
        logger.info(`${userId} deleted post in group ${groupId} successfully`);

        return { message: 'Post deleted successfully' };

    } catch (error) {
        logger.error(`Error deleting post in group: ${error.message}`);
        throw error;
    }
}

const likePostInGroup = async (groupId, userId, postId) => {
    try {
        // Validate groupId, userId, postId
        const { error: idError } = postInGroupValidation({ groupId: groupId, userId: userId, postId: postId });
        if (idError) {
            throw errorHandler(400, `Validation error: ${idError.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({ _id: postId, status: 'public', group: groupId });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the post belongs to a group
        if (existingPost.group === null) {
            throw errorHandler(409, 'This post does not belong to any group');
        }

        // Check if the post belongs to the specified group
        if (existingPost.group.toString() !== groupId) {
            throw errorHandler(409, 'Post does not belong to the specified group');
        }

        // Check if the user has already liked the post
        const hasLiked = existingPost.likes.includes(userId);

        if (hasLiked) {
            // Remove like if the user has already liked the post
            existingPost.likes.pull(userId);
        } else {
            // Add like
            existingPost.likes.push(userId);

            // Create notification for post owner if liker is not the post owner
            if (userId !== existingPost.user.toString()) {
                await notificationModel.create({
                    user: userId,
                    recipients: [existingPost.user],
                    content: `liked your post in group "${group.name}"`,
                    type: "post_like",
                    url: `/group/${groupId}/post/${postId}`,
                });

                // Add socket emit for real-time notification
                const receiverSocketId = getReceiverSocketId(existingPost.user.toString())
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification")
                }
            }
        }

        // Save the updated post
        await existingPost.save();

        const updatedPost = await postModel.findById(postId)
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })

        logger.info(`Successfully ${userId} liked post in group ${groupId}`);

        return updatedPost;

    } catch (error) {
        logger.error(`Error liking post in group: ${error.message}`);
        throw error;
    }
}

const createCommentInGroup = async (groupId, userId, postId, commentData) => {
    try {
        // Validate groupId, userId, postId
        const { error } = commentInGroupValidation({ groupId: groupId, userId: userId, postId: postId, content: commentData.content });
        if (error) {
            throw errorHandler(400, `Validation error: ${error.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({ _id: postId, status: 'public', group: groupId });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the post belongs to a group
        if (existingPost.group === null) {
            throw errorHandler(409, 'This post does not belong to any group');
        }

        // Check if the post belongs to the specified group
        if (existingPost.group.toString() !== groupId) {
            throw errorHandler(409, 'Post does not belong to the specified group');
        }

        // Create a new comment
        const newComment = new commentModel({
            content: commentData.content,
            user: userId,
            post: postId,
            postOwner: existingPost.user
        });

        // Save the new comment
        await newComment.save();

        // Add the comment to the post
        existingPost.comments.push(newComment._id);

        // Update the group with the new comment
        await groupModel.updateOne({ _id: groupId }, { $push: { comments: newComment._id } });

        // Create notification for post owner if commenter is not the post owner
        if (userId !== existingPost.user.toString()) {
            await notificationModel.create({
                user: userId,
                recipients: [existingPost.user],
                content: `commented on your post in group "${group.name}"`,
                type: "post_comment",
                url: `/group/${groupId}/post/${postId}`,
            });

            // Add socket emit for real-time notification
            const receiverSocketId = getReceiverSocketId(existingPost.user.toString())
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification")
            }
        }

        // Save the updated post
        await existingPost.save();

        const updatedPost = await postModel.findById(postId)
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })

        logger.info(`Successfully ${userId} created comment in group ${groupId}`);

        return updatedPost;


    } catch (error) {
        logger.error(`Error creating comment in group: ${error.message}`);
        throw error;
    }
}

const updateCommentInGroup = async (groupId, userId, postId, commentId, commentData) => {
    try {
        // Validate groupId, userId, postId, commentId
        const { error: idError } = updateCommentInGroupValidation({ groupId: groupId, userId: userId, postId: postId, commentId: commentId, content: commentData.content });
        if (idError) {
            throw errorHandler(400, `Invalid group ID: ${idError.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }


        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({
            _id: postId,
            status: 'public',
            group: groupId
        });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the comment exists
        const existingComment = await commentModel.findOne({ _id: commentId });
        if (!existingComment) {
            throw errorHandler(404, 'Comment not found');
        }

        // Check if the user is the owner of the comment
        if (existingComment.user.toString() !== userId) {
            throw errorHandler(403, 'User is not the owner of the comment');
        }

        // Update the comment content
        existingComment.content = commentData.content;

        // Update the group with the new comment
        await groupModel.updateOne({ _id: groupId }, { $push: { comments: existingComment._id } });

        // Save the updated comment
        await existingComment.save();

        const updatedPost = await postModel.findById(postId)
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })

        logger.info(`Successfully ${userId} updated comment in group ${groupId}`);

        return updatedPost;
    } catch (error) {
        logger.error(`Error updating comment in group: ${error.message}`);
        throw error;
    }
}

const deleteCommentInGroup = async (groupId, userId, postId, commentId) => {
    try {
        // Validate groupId, userId, postId, commentId
        const { error: idError } = likeAndDeleteCommentInGroupValidation({ groupId: groupId, userId: userId, postId: postId, commentId: commentId });
        if (idError) {
            throw errorHandler(400, `Invalid group ID: ${idError.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({ _id: postId });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the comment exists
        const existingComment = await commentModel.findOne({ _id: commentId });
        if (!existingComment) {
            throw errorHandler(404, 'Comment not found');
        }

        // Check if the user is the owner of the comment
        if (existingComment.user.toString() !== userId) {
            throw errorHandler(403, 'User is not the owner of the comment');
        }

        // Remove the comment from the post
        existingPost.comments.pull(commentId);

        // Update the group with the new comment
        await groupModel.updateOne({ _id: groupId }, { $pull: { comments: commentId } });

        // Delete the comment
        await commentModel.findByIdAndDelete(commentId);

        const updatedPost = await postModel.findById(postId)
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })
        logger.info(`Successfully ${userId} deleted comment in group ${groupId}`);

        return updatedPost;
    } catch (error) {
        logger.error(`Error deleting comment in group: ${error.message}`);
        throw error;
    }
}

const likeCommentInGroup = async (groupId, userId, postId, commentId) => {
    try {
        // Validate groupId, userId, postId, commentId
        const { error: idError } = likeAndDeleteCommentInGroupValidation({ groupId: groupId, userId: userId, postId: postId, commentId: commentId });
        if (idError) {
            throw errorHandler(400, `Invalid group ID: ${idError.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({ _id: postId, status: 'public', group: groupId });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the comment exists
        const existingComment = await commentModel.findOne({ _id: commentId });
        if (!existingComment) {
            throw errorHandler(404, 'Comment not found');
        }

        // Check if the user has already liked the comment
        const hasLiked = existingComment.likes.includes(userId);

        if (hasLiked) {
            // Remove like if the user has already liked the comment
            existingComment.likes.pull(userId);
        } else {
            // Add like
            existingComment.likes.push(userId);

            // Create notification for comment owner if not the same user
            if (existingComment.user.toString() !== userId) {
                await notificationModel.create({
                    user: userId,
                    recipients: [existingComment.user],
                    content: `liked your comment in group "${group.name}"`,
                    type: "comment_like",
                    url: `/groups/${groupId}/posts/${postId}`,
                });

                // Add socket emit for real-time notification
                const receiverSocketId = getReceiverSocketId(existingComment.user.toString())
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification")
                }
            }
        }

        // Save the updated comment
        await existingComment.save();

        const updatedPost = await postModel.findById(postId)
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })

        logger.info(`Successfully ${userId} liked comment in group ${groupId}`);

        return updatedPost;
    } catch (error) {
        logger.error(`Error liking comment in group: ${error.message}`);
        throw error;
    }
}

const reportPostInGroup = async (groupId, userId, postId) => {
    try {
        // Validate groupId, userId, postId
        const { error: idError } = postInGroupValidation({ groupId: groupId, userId: userId, postId: postId });
        if (idError) {
            throw errorHandler(400, `Invalid group ID: ${idError.message}`);
        }

        // Check if the user is a member of the group or the owner
        const group = await groupModel.findOne({ _id: groupId });
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group is blocked
        const isActive = group.status === 'active';
        if (!isActive) {
            throw errorHandler(404, 'Group is blocked');
        }

        if (group.owner.toString() !== userId && !group.members.includes(userId)) {
            throw errorHandler(409, 'User is neither the owner nor a member of the group');
        }

        // Check if the post exists
        const existingPost = await postModel.findOne({ _id: postId, status: 'public', group: groupId });
        if (!existingPost) {
            throw errorHandler(404, 'Post not found');
        }

        // Check if the user has already reported the post
        const hasReported = existingPost.report.includes(userId);
        if (hasReported) {
            throw errorHandler(400, 'You have already reported this post');
        }

        // Add the user to the report array
        existingPost.report.push(userId);

        // Create notification for admins
        const admins = await userModel.find({ role: 'admin' });
        await notificationModel.create({
            user: userId,
            recipients: admins.map(admin => admin._id),
            content: `reported a post "${existingPost.content}" in group "${group.name}"`,
            type: "admin_group_post_report",
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
        await existingPost.save();

        const updatedPost = await postModel.findById(postId)
            .populate('user', 'username full_name avatarUrl location')
            .populate('likes', 'username full_name avatarUrl')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username full_name avatarUrl location'
                }
            })

        logger.info(`Successfully ${userId} reported post in group ${groupId}`);

        return updatedPost;
    } catch (error) {
        logger.error(`Error reporting post in group: ${error.message}`);
        throw error;
    }
}


module.exports = {
    getAllGroups,
    getOneGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    limitGroupMembers,
    removeGroupMember,
    joinGroup,
    leaveGroup,
    getAllPostsInGroup,
    getPostInGroup,
    createPostInGroup,
    updatePostInGroup,
    deletePostInGroup,
    likePostInGroup,
    createCommentInGroup,
    updateCommentInGroup,
    deleteCommentInGroup,
    likeCommentInGroup,
    searchGroups,
    updateAvatarGroup,
    reportPostInGroup
}
