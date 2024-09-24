const Joi = require('joi');

// Reusable ObjectId validation schema
const objectIdValidation = () => Joi.string()
    .pattern(new RegExp("^[0-9a-fA-F]{24}$"))
    .required()
    .messages({
        "string.base": "ID must be a string",
        "string.pattern.base": "ID must be a valid MongoDB ObjectId",
        "any.required": "ID is required",
        "string.empty": "ID cannot be empty"
    });

// Function to generate field-specific messages
const createFieldMessages = (fieldName, limit) => ({
    "string.base": `${fieldName} must be a string`,
    "string.min": `${fieldName} must be at least ${limit} characters long`,
    "string.max": `${fieldName} can be up to ${limit} characters long`,
    "any.required": `${fieldName} is required`,
    "string.empty": `${fieldName} cannot be empty`
});

module.exports = {
    objectIdValidation,
    createFieldMessages
}