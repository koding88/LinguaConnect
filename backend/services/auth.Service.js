const userModel = require("../models/user.Model");
const logger = require("../utils/loggerUtil");
const errorHandler = require("../utils/errorUtil");
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
const {generateTotpSecret, verifyTotpToken, enable2FA} = require("../utils/totpCodeUtil");
const {getBirthdayForAge, createUsername, getFullName} = require("../utils/profileUtil")

const register = async (userData) => {
    try {
        // Validate user data
        const {error} = registerValidation(userData);
        if (error) {
            logger.error(`Registration failed: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({
            $or: [{email: userData.email}, {username: userData.username}],
        });

        if (existingUser) {
            logger.error(`User already exists: ${userData.email}`);
            throw errorHandler(400, "User already exists");
        }

        // Hash the password
        const hashedPassword = await passwordUtil.hashPassword(userData.password);

        // Create a new user instance
        const newUser = new userModel({
            ...userData,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();
        logger.info(`User ${userData.email} registered successfully`);

        // Generate confirmation token and store it in Redis
        const confirmToken = generateConfirmToken();
        await redisClient.set(
            `confirmToken:${confirmToken}`,
            newUser._id.toString(),
            "EX",
            60 * 60 * 24 // 24 hours
        );

        // Send confirmation email
        await sendVerificationEmail({
            email: userData.email,
            full_name: userData.full_name,
            token: confirmToken,
        });

        return newUser;
    } catch (error) {
        logger.error(
            `Registration failed for email ${userData.email}: ${error.message}`
        );
        throw error;
    }
};


const login = async (identifier, password, otp) => {
    try {
        // Validate user input
        const {error} = authValidation({identifier, password});
        if (error) {
            logger.error(`Login validation error: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Find the user by email or username
        const user = await userModel.findOne({
            $or: [{email: identifier}, {username: identifier}],
        });

        if (!user) {
            logger.error(`User not found: ${identifier}`);
            throw errorHandler(401, "Invalid username or password");
        }

        // Verify the password
        const isPasswordMatch = await passwordUtil.comparePassword(password, user.password);
        if (!isPasswordMatch) {
            logger.error(`Password mismatch for user: ${identifier}`);
            throw errorHandler(401, "Invalid username or password");
        }

        // Check if the user's account is verified
        if (!user.isVerify) {
            const confirmToken = await redisClient.get(`confirmToken:${user._id}`);
            if (confirmToken) {
                await redisClient.expire(`confirmToken:${user._id}`, 60 * 60 * 24); // Extend token expiry
            }

            logger.error(`Account not verified for user: ${identifier}`);
            throw errorHandler(401, "Account not verified");
        }

        // Handle OTP verification if 2FA is enabled
        if (user.isEnable2FA) {
            // Validation OTP 6digits
            const validateOTP = (otp) => /^\d{6}$/.test(otp);
            if (!validateOTP(otp)) {
                logger.error(`Invalid OTP format for 2FA-enabled account: ${identifier}`);
                throw errorHandler(400, "Invalid OTP format");
            }

            if (!otp) {
                logger.error(`OTP required for 2FA-enabled account: ${identifier}`);
                throw errorHandler(401, "OTP required for 2FA-enabled account");
            }

            const twoFASecret = await redisClient.get(`2faSecret:${user._id}`);
            if (!twoFASecret) {
                logger.error(`2FA secret not found for user: ${identifier}`);
                throw errorHandler(401, "2FA secret not found");
            }

            const isOtpValid = verifyTotpToken(twoFASecret, otp);
            if (!isOtpValid) {
                logger.error(`Invalid 2FA OTP for user: ${identifier}`);
                throw errorHandler(401, "Invalid OTP for 2FA");
            }

            logger.info(`2FA OTP verified successfully for user: ${identifier}`);
        } else {
            if (otp) {
                logger.warn(`Ignoring OTP because 2FA is disabled for user: ${identifier}`);
            }
        }

        // Generate and store tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await redisClient.set(`accessToken:${user._id}`, accessToken, "EX", 60 * 20); // 20 minutes
        await redisClient.set(`refreshToken:${user._id}`, refreshToken, "EX", 60 * 60 * 24 * 7); // 7 days

        logger.info(`User ${identifier} logged in successfully`);

        return {accessToken, refreshToken};
    } catch (error) {
        logger.error(`Login error for user ${identifier}: ${error.message}`);
        throw error;
    }
};

const loginGoogle = async (profile) => {
    try {
        const profileData = profile?._json;

        if (!profileData) {
            logger.error("Invalid profile data received from Google");
            throw errorHandler(400, "Invalid profile data")
        }

        // Extract and construct user information from profile data
        const userInfo = {
            full_name: getFullName(profileData?.family_name, profileData?.given_name),
            username: createUsername(profileData?.family_name),
            email: profileData?.email,
            password: await passwordUtil.generatePassword(),
            gender: true,
            birthday: getBirthdayForAge(18),
            location: "",
            isVerify: true,
        };

        // Check if the user already exists
        let user = await userModel.findOne({
            $or: [{email: userInfo.email}, {username: userInfo.username}]
        });

        if (!user) {
            // Create a new user if none exists
            user = new userModel(userInfo);
            await user.save();
            logger.info(`User ${userInfo.email} registered successfully`);
        } else {
            logger.info(`User ${userInfo.email} already exists. Generating tokens.`);
        }

        // Generate and store tokens for the user
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await redisClient.set(`accessToken:${user._id}`, accessToken, "EX", 60 * 20); // 20 minutes
        await redisClient.set(`refreshToken:${user._id}`, refreshToken, "EX", 60 * 60 * 24 * 7); // 7 days

        logger.info(`User ${userInfo.email} logged in successfully`);

        return {accessToken, refreshToken};

    } catch (error) {
        logger.error(`Login error for profile ${profile}: ${error.message}`);
        throw error;
    }
};


const refreshToken = async (refreshToken) => {
    try {
        // Validate the provided refresh token
        const {error} = refreshTokenValidate({refreshToken});
        if (error) {
            logger.error(`Refresh token validation error: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Verify the refresh token and decode it
        const decoded = refreshTokenVerify(refreshToken);
        const userId = decoded?.userId;

        if (!userId) {
            logger.error("Invalid refresh token: No user ID found in the token");
            throw errorHandler(401, "Invalid refresh token");
        }

        // Retrieve the stored refresh token from Redis
        const storedRefreshToken = await redisClient.get(`refreshToken:${userId}`);

        // Check if the stored token matches the provided token
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            logger.error("Invalid refresh token: Token mismatch or not found in Redis");
            throw errorHandler(401, "Invalid refresh token");
        }

        // Generate a new access token
        const accessToken = generateAccessToken({
            _id: userId,
            role: decoded.role,
        });

        // Update the access token in Redis
        await redisClient.set(`accessToken:${userId}`, accessToken, "EX", 60 * 20); // 20 minutes

        logger.info(`New access token generated for user ID ${userId}`);

        return accessToken;
    } catch (error) {
        logger.error(`Error refreshing token: ${error.message}`);
        throw error;
    }
};


const confirmEmail = async (token) => {
    try {
        // Retrieve user ID from Redis using the confirmation token
        const userId = await redisClient.get(`confirmToken:${token}`);
        if (!userId) {
            logger.error("Invalid or expired confirmation token");
            throw errorHandler(400, "Invalid or expired token");
        }

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            logger.error(`User not found for ID: ${userId}`);
            throw errorHandler(400, "User not found");
        }

        // Verify the user's account
        user.isVerify = true;
        await user.save();

        // Remove the confirmation token from Redis
        await redisClient.del(`confirmToken:${token}`);

        // Log successful confirmation
        logger.info(`Email confirmed successfully for user: ${user.email}`);

        // Return the full name of the user
        return user.full_name;
    } catch (error) {
        // Log and rethrow the error for further handling
        logger.error(`Error confirming email: ${error.message}`);
        throw error;
    }
};


const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        // Validate the input passwords
        const {error} = ChangePasswordValidation({oldPassword, newPassword});
        if (error) {
            logger.error(`Change password validation error: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            logger.error(`User not found: ${userId}`);
            throw errorHandler(400, "User not found");
        }

        // Check if the old password matches
        const isOldPasswordValid = await passwordUtil.comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            logger.error(`Invalid old password for user: ${userId}`);
            throw errorHandler(400, "Invalid old password");
        }

        // Hash the new password
        const hashedNewPassword = await passwordUtil.hashPassword(newPassword);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        // Log success and return a success message
        logger.info(`Password changed successfully for user: ${user.email}`);
        return {message: "Password changed successfully"};
    } catch (error) {
        // Log the error and rethrow it for further handling
        logger.error(`Error changing password for user: ${userId} - ${error.message}`);
        throw error;
    }
};


const forgotPassword = async (email) => {
    try {
        // Validate the email address
        const {error} = forgotPasswordValidation({email});
        if (error) {
            logger.error(`Forgot password validation error: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Find the user by email
        const user = await userModel.findOne({email});
        if (!user) {
            logger.error(`User not found: ${email}`);
            throw errorHandler(400, `User with email ${email} not found`);
        }

        // Generate TOTP secret and token
        const {secret, token} = generateTotpSecret();

        // Store the secret in Redis for later verification
        await redisClient.set(`forgotPassword:${user._id}`, secret);

        // Send password reset email
        await sendPasswordResetEmail({
            email: user.email,
            full_name: user.full_name,
            token,
        });

        // Log successful email sending
        logger.info(`Password reset link sent successfully to ${user.email}`);
    } catch (error) {
        // Log the error and rethrow for further handling
        logger.error(`Error sending password reset link for ${email}: ${error.message}`);
        throw error;
    }
};


const resetPassword = async (email, otp, newPassword) => {
    try {
        // Validate input parameters
        const {error} = resetPasswordValidation({email, otp, newPassword});
        if (error) {
            logger.error(`Reset password validation error: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        // Find the user by email
        const user = await userModel.findOne({email});
        if (!user) {
            logger.error(`User not found: ${email}`);
            throw errorHandler(400, `User with email ${email} not found`);
        }

        // Retrieve the secret from Redis
        const secret = await redisClient.get(`forgotPassword:${user._id}`);
        if (!secret) {
            logger.error(`Invalid or expired token for user: ${email}`);
            throw errorHandler(400, "Invalid or expired token");
        }

        // Verify the OTP
        const isOtpValid = verifyTotpToken(secret, otp);
        if (!isOtpValid) {
            logger.error(`Invalid OTP for user: ${email}`);
            throw errorHandler(400, "Invalid OTP");
        }

        // Hash the new password and update the user record
        const hashedPassword = await passwordUtil.hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        // Remove the secret from Redis
        await redisClient.del(`forgotPassword:${user._id}`);

        logger.info(`Password successfully changed for user: ${email}`);
        return {message: 'Password changed successfully'};
    } catch (error) {
        // Log the error and rethrow it for further handling
        logger.error(`Error resetting password for ${email}: ${error.message}`);
        throw error;
    }
};


const get2faQRCodeForUser = async (userId) => {
    try {
        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            logger.error(`User not found: ${userId}`);
            throw errorHandler(400, "User not found");
        }

        // Generate 2FA secret and OTP URL
        const {secret, otp_url} = enable2FA();

        // Store the 2FA secret in Redis
        await redisClient.set(`2faSecret:${userId}`, secret);

        // Enable 2FA for the user
        user.isEnable2FA = true;
        await user.save();

        // Return the OTP URL for QR code generation
        return {otp_url};

    } catch (error) {
        // Log the error and rethrow it for further handling
        logger.error(`Error generating 2FA QR code for user ${userId}: ${error.message}`);
        throw error;
    }
};


const disable2FA = async (userId) => {
    try {
        // Retrieve the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            logger.error(`User not found: ${userId}`);
            throw errorHandler(400, "User not found");
        }

        // Disable 2FA for the user
        user.isEnable2FA = false;
        await user.save();

        // Remove the 2FA secret from Redis
        await redisClient.del(`2faSecret:${userId}`);

        // Return success message
        return {message: "2FA disabled successfully"};

    } catch (error) {
        // Log the error and rethrow it for further handling
        logger.error(`Error disabling 2FA for user ${userId}: ${error.message}`);
        throw error;
    }
};


module.exports = {
    register,
    login,
    refreshToken,
    confirmEmail,
    changePassword,
    forgotPassword,
    resetPassword,
    get2faQRCodeForUser,
    disable2FA,
    loginGoogle
};
