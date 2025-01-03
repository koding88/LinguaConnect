const Joi = require("joi");

const { objectIdValidation, createFieldMessages } = require("../utils/validationUtil");

const registerValidation = (data) => {
    const schema = Joi.object({
        full_name: Joi.string().min(5).max(50).required().messages({
            ...createFieldMessages('full_name', 50),
        }),
        username: Joi.string().min(3).max(50).required().messages({
            ...createFieldMessages('username', 50),
        }),
        avatarUrl: Joi.string().uri().messages({
            "string.base": "Avatar URL must be a string",
            "string.uri": "Avatar URL must be a valid URL",
            "string.empty": "Avatar cannot be empty",
        }),
        email: Joi.string().email().required().messages({
            "string.base": "Email must be a string",
            "string.email": "Email must be a valid email",
            "any.required": "Email is required",
            "string.empty": "Email cannot be empty",
        }),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
            .required()
            .messages({
                "string.base": "Password must be a string.",
                "string.min": "Password must be at least 8 characters long.",
                "string.pattern.base":
                    "Password must include at least one uppercase letter, one lowercase letter, and one number.",
                "any.required": "Password is required.",
                "string.empty": "Password cannot be empty",
            }),
        gender: Joi.boolean().required().messages({
            "boolean.base": "Gender must be a boolean value.",
            "any.required": "Gender is required.",
            "boolean.empty": "Gender cannot be empty",
        }),
        favoriteTopics: Joi.array().items(objectIdValidation).messages({
            "array.base": "Favorite topics must be an array",
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
            ...createFieldMessages('location', 50),
        }),
    });
    return schema.validate(data);
};

const authValidation = (data) => {
    const schema = Joi.object({
        identifier: Joi.alternatives()
            .try(
                Joi.string().email().required(),
                Joi.string().min(3).max(50).required()
            )
            .messages({
                "string.base": "Account must be a string.",
                "string.email": "Account must be a valid email address.",
                "string.min": "Account must be at least 3 characters long.",
                "string.max": "Account can be up to 50 characters long.",
                "any.required": "Account is required.",
                "string.empty": "Account cannot be empty.",
            }),
        password: Joi.string()
            .required()
            .messages({
                "any.required": "Password is required.",
                "string.empty": "Password cannot be empty",
            }),
    });
    return schema.validate(data);
};

const refreshTokenValidate = (data) => {
    const schema = Joi.object({
        refreshToken: Joi.string()
            .pattern(
                new RegExp("^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$")
            ) // Pattern for JWT
            .required()
            .messages({
                "string.base": "Refresh token must be a string",
                "string.pattern.base": "Refresh token has an invalid format",
                "any.required": "Refresh token is required",
                "string.empty": "Refresh token cannot be empty",
            }),
    });
    return schema.validate(data);
};

const ChangePasswordValidation = (data) => {
    const schema = Joi.object({
        oldPassword: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
            .required()
            .messages({
                "string.base": "Old Password must be a string.",
                "string.min": "Old Password must be at least 8 characters long.",
                "string.pattern.base":
                    "Old Password must include at least one uppercase letter, one lowercase letter, and one number.",
                "any.required": "Old Password is required.",
                "string.empty": "Old Password cannot be empty",
            }),
        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
            .required()
            .messages({
                "string.base": "New Password must be a string.",
                "string.min": "New Password must be at least 8 characters long.",
                "string.pattern.base":
                    "New Password must include at least one uppercase letter, one lowercase letter, and one number.",
                "any.required": "New Password is required.",
                "string.empty": "New Password cannot be empty",
            }),
    });
    return schema.validate(data);
}

const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.base": "Email must be a string",
            "string.email": "Email must be a valid email",
            "any.required": "Email is required",
            "string.empty": "Email cannot be empty",
        }),
    });
    return schema.validate(data);
}

const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.base": "Email must be a string",
            "string.email": "Email must be a valid email",
            "any.required": "Email is required",
            "string.empty": "Email cannot be empty",
        }),
        otp: Joi.string().required().messages({
            "string.base": "Token must be a string",
            "any.required": "Token is required",
            "string.empty": "Token cannot be empty",
        }),
        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
            .required()
            .messages({
                "string.base": "Password must be a string.",
                "string.min": "Password must be at least 8 characters long.",
                "string.pattern.base":
                    "Password must include at least one uppercase letter, one lowercase letter, and one number.",
                "any.required": "Password is required.",
                "string.empty": "Password cannot be empty",
            }),
    });
    return schema.validate(data);
}

module.exports = {
    registerValidation,
    authValidation,
    refreshTokenValidate,
    ChangePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation
};
