const topicModel = require('../models/topic.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const { topicIdValidation, topicValidation } = require('../validations/topicValidation');

const getAllTopics = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const [topics, total] = await Promise.all([
            topicModel.find({})
                .skip(skip)
                .limit(limit)
                .exec(),
            topicModel.countDocuments({})
        ]);

        logger.info(`Topics retrieved successfully`);

        return { topics, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
    } catch (error) {
        logger.error(`Error fetching all topics: ${error}`);
        throw error;
    }
}

const getTopicById = async (topicId) => {
    try {
        const { error } = topicIdValidation({ id: topicId });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const topic = await topicModel.findById(topicId);

        if (!topic) {
            throw errorHandler(404, `Topic with ID ${topicId} not found`);
        }

        logger.info(`Topic with ID ${topicId} retrieved successfully`);

        return topic;
    } catch (error) {
        logger.error(`Error fetching topic with ID ${topicId}:`, error);
        throw error;
    }
}

const createTopic = async (data) => {
    try {
        const { name, description } = data;

        const { error } = topicValidation({ name, description });
        if (error) {
            logger.error(`Error validating topic data: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const newTopic = new topicModel({
            name,
            description
        });
        await newTopic.save();

        logger.info(`Topic created successfully`);

        return newTopic;
    } catch (error) {
        logger.error(`Error creating topic:`, error);
        throw error;
    }
}

const updateTopicById = async (topicId, data) => {
    try {
        const { name, description } = data;

        const { error } = topicValidation({ name, description });
        if (error) {
            logger.error(`Error validating topic data: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const topic = await topicModel.findByIdAndUpdate(topicId, { name, description }, { new: true });
        if (!topic) {
            throw errorHandler(404, `Topic with ID ${topicId} not found`);
        }

        logger.info(`Topic with ID ${topicId} updated successfully`);

        return topic;
    } catch (error) {
        logger.error(`Error updating topic with ID ${topicId}:`, error);
        throw error;
    }
}

const deleteTopicById = async (topicId) => {
    try {
        const { error } = topicIdValidation({ id: topicId });
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const topic = await topicModel.findByIdAndDelete(topicId);
        if (!topic) {
            throw errorHandler(404, `Topic with ID ${topicId} not found`);
        }

        logger.info(`Topic with ID ${topicId} deleted successfully`);

        return topic;
    } catch (error) {
        logger.error(`Error deleting topic with ID ${topicId}:`, error);
        throw error;
    }
}

module.exports = {
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopicById,
    deleteTopicById
}