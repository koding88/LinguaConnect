const Joi = require('joi');

const idValidation = (data) => {
    const schema = Joi.object({
        id: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            })
    });

    return schema.validate(data);
};

const createGroupValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(30).required().messages({
            "string.base": "Name must be a string",
            "string.min": "Name must be at least 1 character long",
            "string.max": "Name can be up to 30 characters long",
            "any.required": "Name is required",
            "string.empty": "Name cannot be empty"
        }),
        description: Joi.string().min(1).max(50).required().messages({
            "string.base": "Description must be a string",
            "string.min": "Description must be at least 1 character long",
            "string.max": "Description can be up to 50 characters long",
            "any.required": "Description is required",
            "string.empty": "Description cannot be empty"
        }),
        userId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            })
    });

    return schema.validate(data);
}

const updateGroupValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(30).messages({
            "string.base": "Name must be a string",
            "string.min": "Name must be at least 1 character long",
            "string.max": "Name can be up to 30 characters long",
            "string.empty": "Name cannot be empty"
        }),
        description: Joi.string().min(1).max(50).messages({
            "string.base": "Description must be a string",
            "string.min": "Description must be at least 1 character long",
            "string.max": "Description can be up to 50 characters long",
            "string.empty": "Description cannot be empty"
        })
    });

    return schema.validate(data);
}

const deleteGroupValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            }),
        groupId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            })
    });

    return schema.validate(data);
}

const limitGroupMembersValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            }),
        groupId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            }),
        maxMembers: Joi.number().min(1).max(100).required().messages({
            "number.base": "Limit must be a number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit can be up to 100",
            "any.required": "Limit is required"
        })
    });

    return schema.validate(data);
}

const removeGroupMemberValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            }),
        groupId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            }),
        memberId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            })
    });

    return schema.validate(data);
}

const joinGroupValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            }),
        groupId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            })
    });

    return schema.validate(data);
}

const leaveGroupValidation = (data) => {
    const schema = Joi.object({
        userId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            }),
        groupId: Joi.string()
            .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
            .required()
            .messages({
                "string.base": "ID must be a string",
                "string.pattern.base": "ID must be a valid MongoDB ObjectId",
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty"
            })
    });

    return schema.validate(data);
}



module.exports = {
    idValidation,
    createGroupValidation,
    updateGroupValidation,
    deleteGroupValidation,
    limitGroupMembersValidation,
    removeGroupMemberValidation,
    joinGroupValidation,
    leaveGroupValidation
};
