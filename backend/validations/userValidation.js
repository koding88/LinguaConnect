const Joi = require('joi');

const { objectIdValidation, createFieldMessages } = require("../utils/validationUtil");

const idValidation = (data) => {
    const schema = Joi.object({
        userId: objectIdValidation()
    });

    return schema.validate(data);
}

const getUserValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(1).max(50).required().messages({
            ...createFieldMessages('username', 50),
        }),
    });

    return schema.validate(data);
}

const updateUserValidation = (data) => {
    const schema = Joi.object({
        full_name: Joi.string().min(5).max(50).required().messages({
            ...createFieldMessages('full_name', 50),
        }),
        username: Joi.string().min(3).max(50).required().messages({
            ...createFieldMessages('username', 50),
        }),
        gender: Joi.boolean().required().messages({
            "boolean.base": "Gender must be a boolean value.",
            "any.required": "Gender is required.",
            "boolean.empty": "Boolean cannot be empty",
        }),
        birthday: Joi.date()
            .required()
            .custom((value, helpers) => {
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();
                const month = today.getMonth() - value.getMonth();
                const day = today.getDate() - value.getDate();

                // Check if the birthday is in the future
                if (value > today) {
                    return helpers.message("Birthday cannot be in the future");
                }

                // Check if the user is at least 13 years old
                if (
                    age < 13 ||
                    (age === 13 && (month < 0 || (month === 0 && day < 0)))
                ) {
                    return helpers.message(
                        "User must be at least 13 years old."
                    );
                }
            }),
        location: Joi.string().required().messages({
            "string.base": "Location must be a string",
            "any.required": "Location is required",
            "string.empty": "Location cannot be empty",
        }),
        favoriteTopics: Joi.array().items(objectIdValidation()).messages({
            "array.base": "Favorite topics must be an array",
        }),
    })

    return schema.validate(data);
}

const followUserValidation = (data) => {
    const schema = Joi.object({
        follower: objectIdValidation(),
        following: objectIdValidation()
    });

    return schema.validate(data);
}

const updateAvatarValidation = (data) => {
    const schema = Joi.object({
        avatarUrl: Joi.array().items(Joi.string().uri().messages({
            'string.uri': `"avatarUrl" contains invalid URL`,
            'string.base': `"avatarUrl" must be a valid URL string`,
        })).required().messages({
            'array.base': `"avatarUrl" must be an array`,
            'any.required': `"avatarUrl" is required`,
        }),
    });

    return schema.validate(data);
}


module.exports = {
    idValidation,
    getUserValidation,
    updateUserValidation,
    followUserValidation,
    updateAvatarValidation
}
