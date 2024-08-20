const authService = require("../services/auth.Service");

const registerController = async (req, res) => {
    try {
        const userData = req.body;
        const user = await authService.register(userData);
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginController = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const { accessToken, refreshToken } = await authService.login(
            identifier,
            password
        );
        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const newAccessToken = await authService.refreshToken(refreshToken);
        res.status(200).json({
            status: "success",
            message: "Access token refreshed successfully",
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerController,
    loginController,
    refreshTokenController,
};
