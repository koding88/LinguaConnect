const Joi = require('joi');

const { objectIdValidation, createFieldMessages } = require("../utils/validationUtil");

const idValidation = (data) => {
    const schema = Joi.object({
        id: objectIdValidation()
    });

    return schema.validate(data);
}

const getOneGroupValidation = (data) => {
    const schema = Joi.object({
        groupId: objectIdValidation()
    });

    return schema.validate(data);
};

// Create schema for group creation
const createGroupValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(30).required().messages({
            ...createFieldMessages('name', 30),
            }),
        description: Joi.string().min(1).max(50).required().messages({
            ...createFieldMessages('description', 50),
        }),
        userId: objectIdValidation()
    });

    return schema.validate(data);
};

// Update group validation
const updateGroupValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(30).messages({
            ...createFieldMessages('name', 30),
        }),
        description: Joi.string().min(1).max(50).messages({
            ...createFieldMessages('description', 50),
        }),
    })  

    return schema.validate(data);
};

// Delete group validation
const deleteGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation()
    });

    return schema.validate(data);
};

// Limit group members validation
const limitGroupMembersValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation(),
        maxMembers: Joi.number().min(1).max(100).required().messages({
            "number.base": "Limit must be a number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit can be up to 100",
            "any.required": "Limit is required"
        })
    });

    return schema.validate(data);
};

// Remove group member validation
const removeGroupMemberValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation(),
        memberId: objectIdValidation()
    });

    return schema.validate(data);
};

// Join group validation
const joinGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation()
    });

    return schema.validate(data);
};

// Leave group validation
const leaveGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation()
    });

    return schema.validate(data);
};

// Get All Posts In Group validation
const getAllPostsInGroupValidation = (data) => {
    const schema = Joi.object({
        groupId: objectIdValidation()
    });

    return schema.validate(data);
};

// Create Post In Group Validation
const createPostInGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation(),
        content: Joi.string().min(1).max(63206).required().messages({
            ...createFieldMessages('content', 63206),
        }),
    });

    return schema.validate(data);
};

// Post In Group Validation
const postInGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation(),
        postId: objectIdValidation(),
    });

    return schema.validate(data);
};

// Update Post In Group Validation
const updatePostInGroupValidation = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(1).max(63206).required().messages({
            ...createFieldMessages('content', 63206),
        }),
        urls: Joi.array().items(Joi.string().uri().messages({
            'string.uri': `"urls" contains invalid URL`,
            'string.base': `"urls" must be a valid URL string`,
        })).optional(),

        images: Joi.array().items(Joi.string().uri().messages({
            'string.uri': `"images" contains invalid URL`,
            'string.base': `"images" must be a valid URL string`,
        })).optional()
    });

    return schema.validate(data);
};

const commentInGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation(),
        postId: objectIdValidation(),
        content: Joi.string().min(1).max(8000).required().messages({
            ...createFieldMessages('content', 8000),
        }),
    });

    return schema.validate(data);
};

const updateCommentInGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation(),
        postId: objectIdValidation(),
        commentId: objectIdValidation(),
        content: Joi.string().min(1).max(8000).required().messages({
            ...createFieldMessages('content', 8000),
        }),
    });

    return schema.validate(data);
};

const likeAndDeleteCommentInGroupValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        groupId: objectIdValidation(),
        postId: objectIdValidation(),
        commentId: objectIdValidation(),
    });

    return schema.validate(data);
}   

// Export all validation functions
module.exports = {
    idValidation,
    getOneGroupValidation,
    createGroupValidation,
    updateGroupValidation,
    deleteGroupValidation,
    limitGroupMembersValidation,
    removeGroupMemberValidation,
    joinGroupValidation,
    leaveGroupValidation,
    getAllPostsInGroupValidation,
    createPostInGroupValidation,
    postInGroupValidation,
    updatePostInGroupValidation,
    commentInGroupValidation,
    updateCommentInGroupValidation,
    likeAndDeleteCommentInGroupValidation
};