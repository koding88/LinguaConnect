const messageModel = require("../models/message.Model");
const userModel = require('../models/user.Model');
const conversationModel = require("../models/conversation.Model");
const logger = require("../utils/loggerUtil");
const errorHandler = require("../utils/errorUtil");
const { idValidation } = require("../validations/userValidation");
const { getReceiverSocketId, io } = require("../sockets/sockets");

const getAllMessages = async (userId, userToChatId) => {
    try {
        // Validate that neither user is an admin
        const users = await userModel.find({
            _id: { $in: [userId, userToChatId] },
            role: 'admin'
        });

        if (users.length > 0) {
            logger.warn(`Cannot fetch messages - one or more users is an admin`);
            throw errorHandler(403, 'Cannot chat with admin users');
        }

        logger.info(`Fetching messages for conversation between users ${userId} and ${userToChatId}`);
        const conversation = await conversationModel.findOne({
            participants: { $all: [userId, userToChatId] }
        }).populate("messages");

        if (!conversation) {
            logger.warn(`Conversation not found for users ${userId} and ${userToChatId}`);
            return [];
        }

        logger.info(`Successfully fetched messages for conversation between users ${userId} and ${userToChatId}`);
        return conversation.messages;
    } catch (error) {
        logger.error(`Error in getAllMessages: ${error.message}`, { error });
        throw error;
    }
}

const getAllMessagesToAI = async (userId, userToChatId) => {
    try {
        // Validate that neither user is an admin
        const users = await userModel.find({
            _id: { $in: [userId, userToChatId] },
            role: 'admin'
        });

        if (users.length > 0) {
            logger.warn(`Cannot fetch messages - one or more users is an admin`);
            throw errorHandler(403, 'Cannot chat with admin users');
        }

        logger.info(`Fetching messages for conversation between users ${userId} and ${userToChatId}`);
        const conversation = await conversationModel.findOne({
            participants: { $all: [userId, userToChatId] }
        }).populate({
            path: "messages",
            populate: [
                {
                    path: "senderId", 
                    model: "User",
                    select: "full_name"
                },
                {
                    path: "receiverId",
                    model: "User", 
                    select: "full_name"
                }
            ]
        });

        if (!conversation) {
            logger.warn(`Conversation not found for users ${userId} and ${userToChatId}`);
            return [];
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

        // Check if either user is admin
        const users = await userModel.find({
            _id: { $in: [senderId, receiverId] },
            role: 'admin'
        });

        if (users.length > 0) {
            logger.warn(`Cannot send message - one or more users is an admin`);
            throw errorHandler(403, 'Cannot chat with admin users');
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

        // emit
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        logger.info(`Successfully sent message from user ${senderId} to user ${receiverId}`);
        return newMessage;
    } catch (error) {
        logger.error(`Error in sendMessage: ${error.message}`, { error });
        throw error;
    }
}

const getConversations = async (userId) => {
    try {
        // Validate userId
        const { error } = idValidation({ userId });
        if (error) {
            logger.error(`Error validating user ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Find conversations, excluding admins and current user
        const conversations = await userModel.find({ 
            _id: { $ne: userId },
            role: { $ne: 'admin' }
        })
            .select("_id username full_name avatarUrl")
            .lean();

        if (conversations.length === 0) {
            logger.info(`No conversations found for user ${userId}`);
            return []; // Return an empty array instead of throwing an error
        }

        return conversations;
    } catch (error) {
        logger.error(`Error getting conversations for user ${userId}: ${error.message}`);
        throw error;
    }
};

module.exports = {
    getAllMessages,
    sendMessage,
    getConversations,
    getAllMessagesToAI
};
