const Joi = require('joi');
const { objectIdValidation, createFieldMessages } = require("../utils/validationUtil");

const topicIdValidation = (id) => {
    const schema = Joi.object({
        id: objectIdValidation()
    });
    return schema.validate(id);
}

const topicValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(30).required().messages({
            ...createFieldMessages('name', 30),
    }),
    description: Joi.string().min(1).max(5000).required().messages({
        ...createFieldMessages('description', 5000),
        }),
    });

    return schema.validate(data);
}

module.exports = {
    topicIdValidation,
    topicValidation
}