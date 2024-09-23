const groupService = require('../services/group.Service');

const getAllGroupsController = async (req, res, next) => {
    try {
        const groups = await groupService.getAllGroups();

        res.status(200).json({
            status: 'success',
            message: 'Groups fetched successfully',
            data: groups,
        });
    } catch (error) {
        next(error);
    }
}

const getGroupByIdController = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const group = await groupService.getOneGroup(groupId);

        res.status(200).json({
            status: 'success',
            message: 'Group fetched successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const createGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { name, description } = req.body;

        const group = await groupService.createGroup({ name, description, userId });

        res.status(201).json({
            status: 'success',
            message: 'Group created successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const updateGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const { name, description } = req.body;

        const group = await groupService.updateGroup(groupId, userId, { name, description });

        res.status(200).json({
            status: 'success',
            message: 'Group updated successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const deleteGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;

        await groupService.deleteGroup(groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Group deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

const limitGroupMembersController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const { maxMembers } = req.body;

        const group = await groupService.limitGroupMembers(groupId, userId, maxMembers);

        res.status(200).json({
            status: 'success',
            message: 'Group members limited successfully',
            data: group,
        });
    } catch (error) {
        next(error);
    }
}

const removeGroupMemberController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const { memberId } = req.body;

        await groupService.removeGroupMember(groupId, userId, memberId);

        res.status(200).json({
            status: 'success',
            message: 'Group member removed successfully',
        });
    } catch (error) {
        next(error);
    }
}

const joinGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;

        await groupService.joinGroup(groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Joined group successfully',
        });
    } catch (error) {
        next(error);
    }
}

const leaveGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;

        await groupService.leaveGroup(groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Left group successfully',
        });
    } catch (error) {
        next(error);
    }
}

const getAllPostsInGroupController = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const userId = req.userId;
        const posts = await groupService.getAllPostsInGroup(groupId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Posts fetched successfully',
            data: posts,
        });
    } catch (error) {
        next(error);
    }
}

const getPostInGroupController = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const postId = req.params.postId;
        const userId = req.userId;

        const post = await groupService.getPostInGroup(groupId, postId, userId);

        res.status(200).json({
            status: 'success',
            message: 'Post fetched successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

const createPostInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const { content } = req.body;
        const images = req.fileUrls;

        const post = await groupService.createPostInGroup(groupId, userId, { content, images });

        res.status(201).json({
            status: 'success',
            message: 'Post created successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

const updatePostInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const postId = req.params.postId;
        const { content, urls } = req.body;

        // Initialize images to an empty array if not provided
        const images = req.fileUrls || [];

        // Ensure urls is always an array and filter out any undefined values
        const normalizedUrls = Array.isArray(urls) ? urls.filter(url => url) : [urls].filter(url => url);

        const postData = {
            ...(content !== undefined && { content }),
            ...(normalizedUrls.length > 0 && { urls: normalizedUrls }),
            ...(images.length > 0 && { images }),
        };

        const post = await groupService.updatePostInGroup(groupId, userId, postId, postData);

        res.status(200).json({
            status: 'success',
            message: 'Post updated successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

const deletePostInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const postId = req.params.postId;

        await groupService.deletePostInGroup(groupId, userId, postId);

        res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

const likePostInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const postId = req.params.postId;

        await groupService.likePostInGroup(groupId, userId, postId);

        res.status(200).json({
            status: 'success',
            message: 'Post liked successfully',
        });
    } catch (error) {
        next(error);
    }
}

const createCommentInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const postId = req.params.postId;
        const { content } = req.body;

        const comment = await groupService.createCommentInGroup(groupId, userId, postId, { content });

        res.status(201).json({
            status: 'success',
            message: 'Comment created successfully',
            data: comment,
        });
    } catch (error) {
        next(error);
    }
}

const updateCommentInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const { content } = req.body;
        
        const comment = await groupService.updateCommentInGroup(groupId, userId, postId, commentId, { content });

        res.status(200).json({
            status: 'success',
            message: 'Comment updated successfully',
            data: comment,
        });
    } catch (error) {
        next(error);
    }
}

const deleteCommentInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        
        await groupService.deleteCommentInGroup(groupId, userId, postId, commentId);

        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

const likeCommentInGroupController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const groupId = req.params.id;
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        
        await groupService.likeCommentInGroup(groupId, userId, postId, commentId);

        res.status(200).json({
            status: 'success',
            message: 'Comment liked successfully',
        });
    } catch (error) {
        next(error);
    }
}  


module.exports = {
    getAllGroupsController,
    getGroupByIdController,
    createGroupController,
    updateGroupController,
    deleteGroupController,
    limitGroupMembersController,
    removeGroupMemberController,
    joinGroupController,
    leaveGroupController,
    getAllPostsInGroupController,
    getPostInGroupController,
    createPostInGroupController,
    updatePostInGroupController,
    deletePostInGroupController,
    likePostInGroupController,
    createCommentInGroupController,
    updateCommentInGroupController,
    deleteCommentInGroupController,
    likeCommentInGroupController
}