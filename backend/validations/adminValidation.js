const Joi = require("joi");

const IdValidation = (data) => {
    const schema = Joi.object({
        id: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
    });
    return schema.validate(data);
}

const searchAccountValidation = (data) => {
    const schema = Joi.object({
        key: Joi.string().min(1).max(255).required().messages({
            "string.base": "Key must be a string.",
            "string.min": "Key must be at least 1 character long.",
            "string.max": "Key can be up to 255 characters long.",
            "any.required": "Key is required.",
            "string.empty": "Key cannot be empty.",
        }),
    });

    return schema.validate(data);
};


module.exports = {IdValidation, searchAccountValidation}

