const Joi = require('joi');

const { objectIdValidation, createFieldMessages } = require("../utils/validationUtil");

const createCommentValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        postId: objectIdValidation(),
        content: Joi.string().min(1).max(800).required().messages({
            ...createFieldMessages('content', 800),
        }),
    });

    return schema.validate(data);
}

const updateCommentValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        postId: objectIdValidation(),
        commentId: objectIdValidation(),
        content: Joi.string().min(1).max(800).required().messages({
            ...createFieldMessages('content', 800),
        })
    });

    return schema.validate(data);
}

const likeAndDeleteCommentValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation(),
        postId: objectIdValidation(),
        commentId: objectIdValidation(),
    }); 

    return schema.validate(data);
}

module.exports = {createCommentValidation, updateCommentValidation, likeAndDeleteCommentValidation};