const Joi = require('joi');

const idValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required().messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
    });

    return schema.validate(data);
}

const getUserValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required().messages({
            "string.base": "Username must be a string",
            "string.min": "Username must be at least 3 characters long",
            "string.max": "Username can be up to 50 characters long",
            "any.required": "Username is required",
            "string.empty": "Username cannot be empty",
        }),
    });

    return schema.validate(data);
}

const updateUserValidation = (data) => {
    const schema = Joi.object({
        // full_name, username, gender, birthday, location
        full_name: Joi.string().min(5).max(50).required().messages({
            "string.base": "Full name must be a string.",
            "string.min": "Full name must be at least 5 characters long.",
            "string.max": "Full name can be up to 50 characters long.",
            "any.required": "Full name is required.",
            "string.empty": "Full name cannot be empty",
        }),
        username: Joi.string().min(3).max(50).required().messages({
            "string.base": "Username must be a string",
            "string.min": "Username must be at least 3 characters long",
            "string.max": "Username can be up to 50 characters long",
            "any.required": "Username is required",
            "string.empty": "Username cannot be empty",
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
    })

    return schema.validate(data);
}

const followUserValidation = (data) => {
    const schema = Joi.object({
        follower: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        }),
        following: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).messages({
            "string.base": "ID must be a string",
            "string.pattern.base": "ID must be a valid MongoDB ObjectId",
            "any.required": "ID is required",
            "string.empty": "ID cannot be empty",
        })
    });

    return schema.validate(data);
}


module.exports = {
    idValidation,
    getUserValidation,
    updateUserValidation,
    followUserValidation
}