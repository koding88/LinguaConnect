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

module.exports = {IdValidation}

