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

module.exports = {
    getAllMessagesController,
    sendMessageController,
};
