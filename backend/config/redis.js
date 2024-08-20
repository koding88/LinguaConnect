const redis = require("redis");
const logger = require("../utils/loggerUtil");

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
    logger.error("Redis error: ", error.message);
});

const connectRedisDB = async () => {
    try {
        await redisClient.connect();
        logger.info("Redis connected");
    } catch (error) {
        logger.error("Redis connection failed:", error.message);
        throw new Error("Redis connection failed");
    }
};

module.exports = {
    connectRedisDB,
    redisClient,
};
