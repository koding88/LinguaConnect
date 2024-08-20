const mongoose = require("mongoose");
const logger = require("../utils/loggerUtil");
require("dotenv").config();

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error("MongoDB connection failed:", error.message);
        throw new Error("MongoDB connection failed:", error.message);
    }
};

module.exports = { connectMongoDB };
