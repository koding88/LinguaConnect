const messageModel = require("../models/message.model");
const conversationModel = require("../models/conversation.model");
const logger = require("../utils/loggerUtil");

const getAllMessages = async (userId, userToChatId) => {
    try {
        logger.info(`Fetching messages for conversation between users ${userId} and ${userToChatId}`);
        const conversation = await conversationModel.findOne({
            participants: { $all: [userId, userToChatId] }
        }).populate("messages");

        if (!conversation) {
            logger.warn(`Conversation not found for users ${userId} and ${userToChatId}`);
            throw new Error("Conversation not found");
        }

        logger.info(`Successfully fetched messages for conversation between users ${userId} and ${userToChatId}`);
        return conversation.messages;
    } catch (error) {
        logger.error(`Error in getAllMessages: ${error.message}`, { error });
        throw error;
    }
}

const sendMessage = async (senderId, receiverId, message) => {
    try {
        if (senderId === receiverId) {
            logger.warn(`User ${senderId} attempted to send a message to themselves`);
            throw new Error("You cannot send a message to yourself");
        }

        logger.info(`Attempting to send message from user ${senderId} to user ${receiverId}`);
        let conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            logger.info(`Creating new conversation for users ${senderId} and ${receiverId}`);
            conversation = await conversationModel.create({ participants: [senderId, receiverId] });
        }

        const newMessage = await messageModel.create({ senderId, receiverId, message });

        if (!newMessage) {
            logger.error(`Failed to create message from user ${senderId} to user ${receiverId}`);
            throw new Error("Failed to send message");
        }

        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        logger.info(`Successfully sent message from user ${senderId} to user ${receiverId}`);
        return newMessage;
    } catch (error) {
        logger.error(`Error in sendMessage: ${error.message}`, { error });
        throw error;
    }
}

module.exports = {
    getAllMessages,
    sendMessage,
};
