const messageService = require("../services/message.Service");

const getAllMessagesController = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const userId = req.userId;
        const messages = await messageService.getAllMessages(userId, userToChatId);

        res.status(200).json({
            status: "success",
            message: "Messages fetched successfully",
            data: messages,
        });
    } catch (error) {
        next(error);
    }
}

const getAllMessagesToAIController = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const { userId } = req.body;
        const messages = await messageService.getAllMessagesToAI(userId, userToChatId);

        res.status(200).json({
            status: "success",
            message: "Messages fetched successfully",
            data: messages,
        });
    } catch (error) {
        next(error);
    }
}

const sendMessageController = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        const newMessage = await messageService.sendMessage(senderId, receiverId, message);

        res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        next(error);
    }
}

const getConversationsController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const conversations = await messageService.getConversations(userId);
        res.status(200).json({
            status: 'success',
            message: 'Conversations retrieved successfully',
            data: conversations,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllMessagesController,
    sendMessageController,
    getConversationsController,
    getAllMessagesToAIController
};
