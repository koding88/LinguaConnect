const userModel = require("../models/user.Model");
const logger = require("../utils/loggerUtil");
const passwordUtil = require("../utils/passwordUtil");
const {
    generateAccessToken,
    generateRefreshToken,
    accessTokenVerify,
    refreshTokenVerify,
} = require("../utils/tokenUtil");
const { redisClient } = require("../config/redis");
const {
    registerValidation,
    authValidation,
    refreshTokenValidate,
} = require("../validations/authValidation");

const register = async (userData) => {
    try {
        const { error } = registerValidation(userData);
        if (error) {
            logger.error(`Registration failed: ${error.message}`);
            throw new Error(error.message);
        }

        const user = await userModel.findOne({
            $or: [{ email: userData?.email }, { username: userData?.username }],
        });

        if (user) {
            throw new Error("User already exists");
        }

        const hashPassword = await passwordUtil.hashPassword(userData.password);
        const newUser = new userModel({
            ...userData,
            password: hashPassword,
        });

        logger.info(`User ${userData?.email} registered successfully`);
        return await newUser.save();
    } catch (error) {
        logger.error(
            `Registration failed for email ${userData?.email}: ${error.message}`
        );
        throw error;
    }
};

const login = async (identifier, password) => {
    try {
        const { error } = authValidation({ identifier, password });
        if (error) {
            logger.error(`Login user error: ${error.message}`);
            throw new Error(error.message);
        }

        const user = await userModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
            logger.error(`Wrong credentials: User ${identifier} not found`);
            throw new Error("Wrong credentials: Invalid username or password");
        }

        const isMatch = await passwordUtil.comparePassword(
            password,
            user.password
        );

        if (!isMatch) {
            logger.error(
                `Invalid credentials: Password of ${identifier} mismatch`
            );
            throw new Error("Wrong credentials: Invalid username or password");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save accessToken and refreshToken in Redis
        redisClient.set(`accessToken:${user._id}`, accessToken, "EX", 60 * 20); // Access token expires in 20 minutes
        redisClient.set(
            `refreshToken:${user._id}`,
            refreshToken,
            "EX",
            60 * 60 * 24 * 7
        ); // Refresh token expires in 7 days

        return { accessToken, refreshToken };
    } catch (error) {
        logger.error("Login user error: ", error);
        throw error;
    }
};

const refreshToken = async (refreshToken) => {
    try {
        const { error } = refreshTokenValidate({ refreshToken });
        if (error) {
            logger.error(`Refresh token validation error: ${error.message}`);
            throw new Error(error.message);
        }

        const decoded = refreshTokenVerify(refreshToken);
        const userId = decoded?.userId;

        const storedRefreshToken = await redisClient.get(
            `refreshToken:${userId}`
        );

        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            logger.error(
                "Invalid refresh token: Token mismatch or not found in Redis"
            );
            throw new Error("Invalid refresh token");
        }

        // Generate a new access token
        const accessToken = generateAccessToken({
            _id: userId,
            role: decoded.role,
        });

        // Update the access token in Redis
        redisClient.set(`accessToken:${userId}`, accessToken, "EX", 60 * 20); // 20 minutes

        return accessToken;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

module.exports = {
    register,
    login,
    refreshToken,
};
