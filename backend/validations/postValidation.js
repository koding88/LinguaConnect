const Joi = require('joi');

const postValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
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

module.exports = {postValidation};
