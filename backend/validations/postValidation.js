const Joi = require('joi');

const { objectIdValidation, createFieldMessages } = require("../utils/validationUtil");

const postValidation = (data) => {
    const schema = Joi.object({
        id: objectIdValidation(),
        content: Joi.string().max(1600).messages({
            ...createFieldMessages('content', 1600),
        })
    });

    return schema.validate(data);
}

const getPostValidation = (data) => {
    const schema = Joi.object({
        id: objectIdValidation()
    });

    return schema.validate(data);
}

const postIdValidation = (data) => {
    const schema = Joi.object({
        postId: objectIdValidation(),
        userId: objectIdValidation()
    });

    return schema.validate(data);
}

const updatePostValidation = (data) => {
    const schema = Joi.object({
        content: Joi.string().max(1600).allow('').messages({
            ...createFieldMessages('content', 1600),
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

    return schema.validate(data, {abortEarly: false}); 
}

module.exports = {postValidation, postIdValidation, updatePostValidation, getPostValidation};
