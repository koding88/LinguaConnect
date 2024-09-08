const userModel = require("../models/user.Model");
const logger = require("../utils/loggerUtil");
const passwordUtil = require("../utils/passwordUtil");
const {
    generateAccessToken,
    generateRefreshToken,
    accessTokenVerify,
    refreshTokenVerify,
    generateConfirmToken,
} = require("../utils/tokenUtil");
const {redisClient} = require("../config/redis");
const {sendVerificationEmail, sendPasswordResetEmail} = require("../providers/emailProvider");
const {
    registerValidation,
    authValidation,
    refreshTokenValidate,
    ChangePasswordValidation, forgotPasswordValidation, resetPasswordValidation
} = require("../validations/authValidation");
const {generateTotpSecret, verifyTotpToken} = require("../utils/totpCodeUtil");

const register = async (userData) => {
    try {
        const {error} = registerValidation(userData);
        if (error) {
            logger.error(`Registration failed: ${error.message}`);
            throw new Error(error.message);
        }

        const user = await userModel.findOne({
            $or: [{email: userData?.email}, {username: userData?.username}],
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

        await newUser.save();

        const confirmToken = generateConfirmToken();
        await redisClient.set(
            `confirmToken:${confirmToken}`,
            newUser?._id.toString(),
            "EX",
            60 * 60 * 24
        ); // 24 hours

        // Send confirmation email
        await sendVerificationEmail({
            email: userData.email,
            full_name: userData.full_name,
            token: confirmToken,
        });
        return newUser;
    } catch (error) {
        logger.error(
            `Registration failed for email ${userData?.email}: ${error.message}`
        );
        throw error;
    }
};

const login = async (identifier, password) => {
    try {
        const {error} = authValidation({identifier, password});
        if (error) {
            logger.error(`Login user error: ${error.message}`);
            throw new Error(error.message);
        }

        const user = await userModel.findOne({
            $or: [{email: identifier}, {username: identifier}],
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

        if (!user.isVerify) {
            const confirmToken = await redisClient.get(
                `confirmToken:${user._id}`
            );
            if (confirmToken) {
                await redisClient.expire(
                    `confirmToken:${user._id}`,
                    60 * 60 * 24
                ); // 24 hours
            }

            logger.error(`Account not verified: User ${identifier}`);
            throw new Error("Account not verified");
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
        logger.info(`User ${identifier} logged in successfully`);

        return {accessToken, refreshToken};
    } catch (error) {
        logger.error("Login user error: ", error);
        throw error;
    }
};

const refreshToken = async (refreshToken) => {
    try {
        const {error} = refreshTokenValidate({refreshToken});
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

const confirmEmail = async (token) => {
    try {
        // Retrieve user ID from Redis using the token
        const userId = await redisClient.get(`confirmToken:${token}`);
        if (!userId) {
            throw new Error("Invalid or expired token");
        }

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Verify the user account
        user.isVerify = true;
        await user.save();

        // Remove the token from Redis
        await redisClient.del(`confirmToken:${token}`);

        // Log successful confirmation
        logger.info(`User ${user.email} email confirmed successfully`);

        // result
        const full_name = user.full_name;

        return full_name;
    } catch (error) {
        // Log and rethrow the error for further handling
        logger.error(`Error confirming email: ${error.message}`);
        throw error;
    }
};

const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const {error} = ChangePasswordValidation({oldPassword, newPassword});
        if (error) {
            logger.error(`Change password validation error: ${error.message}`);
            throw new Error(error.message);
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await passwordUtil.comparePassword(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Old password is incorrect");
        }

        const hashPassword = await passwordUtil.hashPassword(newPassword);

        user.password = hashPassword;
        await user.save();

        logger.info(`Password changed successfully for user: ${user.email}`);
        return {message: "Password changed successfully"};
    } catch (error) {
        logger.error(`Error changing password for user: ${userId} - ${error.message}`);
        throw new Error(error.message);
    }
}

const forgotPassword = async (email) => {
    try {
        const {error} = forgotPasswordValidation({email});
        if (error) {
            throw new Error(error.message);
        }

        const user = await userModel.findOne({email});
        if (!user) {
            throw new Error(`User: ${email} not found`);
        }

        const {secret, token} = generateTotpSecret();

        // Save the secret in Redis
        await redisClient.set(`forgotPassword:${user._id}`, secret);

        // Send password reset email
        await sendPasswordResetEmail({
            email: user.email,
            full_name: user.full_name,
            token,
        });

        logger.info(`Password reset link sent successfully to ${user.email}`);
    } catch (error) {
        logger.error(`Failed to send password reset link for ${email}. Error: ${error.message}`);
        throw error;
    }
}

const resetPassword = async (email, otp, newPassword) => {
    try {
        const {error} = resetPasswordValidation({email, otp, newPassword});
        if (error) {
            throw new Error(error.message);
        }

        const user = await userModel.findOne({email});
        if (!user) {
            throw new Error(`User: ${email} not found`);
        }

        const secret = await redisClient.get(`forgotPassword:${user._id}`);

        if (!secret) {
            throw new Error("Invalid or expired token");
        }

        const verified = verifyTotpToken(secret, otp);

        if (!verified) {
            throw new Error("Invalid OTP");
        }

        const hashPassword = await passwordUtil.hashPassword(newPassword);
        user.password = hashPassword;
        await user.save();

        // Remove the secret from Redis
        await redisClient.del(`forgotPassword:${user._id}`);

        return {message: 'Password changed successfully'};
    } catch (error) {
        logger.error(`Error resetting password for ${email}. Error: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    confirmEmail,
    changePassword,
    forgotPassword,
    resetPassword
};
