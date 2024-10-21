const redis = require("redis");
const logger = require("../utils/loggerUtil");

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
    logger.error("Redis error: ", error.message);
});

const connectRedisDB = async () => {
    const reconnect = async () => {
        try {
            await redisClient.connect();
            logger.info("Redis connected");
        } catch (error) {
            logger.error("Redis connection failed:", error.message);
            logger.info("Attempting to reconnect in 30 seconds...");
            setTimeout(reconnect, 30000);
        }
    };

    await reconnect();
};

module.exports = {
    connectRedisDB,
    redisClient,
};
