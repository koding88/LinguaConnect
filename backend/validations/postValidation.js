const Joi = require('joi');

const PostValidation = (data) => {
    const schema = Joi.object({
        id: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        content: Joi.string().max(63206).required().messages({
            "string.base": "Content must be a string",
            "string.max": "Content can be up to 63206 characters long",
            "any.required": "Content is required",
            "string.empty": "Content cannot be empty",
        })
    });

    return schema.validate(data);
}

const idValidation = (data) => {
    const schema = Joi.object({
        id: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        })
    });

    return schema.validate(data);
}

const updatePostValidation = (data) => {
    const schema = Joi.object({
        content: Joi.string().max(63206).allow('').messages({
            "string.base": "Content must be a string",
            "string.max": "Content can be up to 63206 characters long",
            "string.empty": "Content cannot be empty",
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

    return schema.validate(data, { abortEarly: false });
}

module.exports = {PostValidation, idValidation, updatePostValidation};
