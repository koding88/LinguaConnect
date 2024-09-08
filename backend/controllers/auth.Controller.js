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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
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
        if (
            error.message ===
                "Wrong credentials: Invalid username or password" ||
            error.message === "Account not verified"
        ) {
            res.status(401).json({
                status: "error",
                message: error.message,
            });
        } else {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const confirmEmailController = async (req, res) => {
    try {
        const { token } = req.query;
        const full_name = await authService.confirmEmail(token);
        const loginUrl = `${process.env.CLIENT_URL}/login`;

        res.render("confirmation", {
            full_name,
            loginUrl,
        });
    } catch (error) {
        console.log(error);
        res.render("error");
    }
};

const changePasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.userId;
        const result = await authService.changePassword(userId, oldPassword, newPassword);
        res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

module.exports = {
    registerController,
    loginController,
    refreshTokenController,
    confirmEmailController,
    changePasswordController
};
