const jwt = require("jsonwebtoken");
const logger = require("./loggerUtil");
const crypto = require("crypto");

const generateAccessToken = (payload) => {
    try {
        const accessToken = jwt.sign(
            {
                userId: payload._id,
                role: payload.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );
        return accessToken;
    } catch (error) {
        throw new Error("Generate access token error");
    }
};

const generateRefreshToken = (payload) => {
    try {
        const refreshToken = jwt.sign(
            {
                userId: payload._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d",
            }
        );
        return refreshToken;
    } catch (error) {
        throw new Error("Generate refresh token error");
    }
};

const generateConfirmToken = () => {
    try {
        const confirmToken = crypto.randomBytes(32).toString("hex");
        return confirmToken;
    } catch (error) {
        throw new Error("Generate confirm token error");
    }
};

const accessTokenVerify = (accessToken) => {
    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        return payload;
    } catch (error) {
        throw new Error("Access token verify error");
    }
};

const refreshTokenVerify = (refreshToken) => {
    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        return payload;
    } catch (error) {
        throw new Error("Refresh token verify error");
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    accessTokenVerify,
    refreshTokenVerify,
    generateConfirmToken,
};
