const Joi = require('joi');

const createCommentValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        postId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        content: Joi.string().min(1).max(8000).required().messages({
            "string.base": "Content must be a string",
            "string.min": "Content must be at least 1 character long",
            "string.max": "Content can be up to 8000 characters long",
            "any.required": "Content is required",
            "string.empty": "Content cannot be empty",
        })
    });

    return schema.validate(data);
}

const updateCommentValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        postId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        commentId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        content: Joi.string().min(1).max(8000).required().messages({
            "string.base": "Content must be a string",
            "string.min": "Content must be at least 1 character long",
            "string.max": "Content can be up to 8000 characters long",
            "any.required": "Content is required",
            "string.empty": "Content cannot be empty",
        })
    });

    return schema.validate(data);
}

const deleteCommentValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        postId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        commentId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        })
    })

    return schema.validate(data);
}

module.exports = {createCommentValidation, updateCommentValidation, deleteCommentValidation};