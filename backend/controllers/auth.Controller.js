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
        const { identifier, password, otp } = req.body;

        // Call login service to authenticate user
        const { accessToken, refreshToken } = await authService.login(identifier, password, otp);

        // Respond with tokens if login is successful
        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    } catch (error) {
        // Handle specific known error cases
        if (
            error.message === "Wrong credentials: Invalid username or password" ||
            error.message === "Account not verified"
        ) {
            res.status(401).json({
                status: "error",
                message: error.message,
            });
        } else if (error.message === "OTP required for 2FA-enabled account") {
            res.status(401).json({
                status: "error",
                message: error.message,
            });
        } else if (error.message === "Invalid OTP for 2FA") {
            res.status(401).json({
                status: "error",
                message: "Invalid OTP, please try again",
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
};


const refreshTokenController = async (req, res) => {
    try {
        const {refreshToken} = req.body;
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
        const {token} = req.query;
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
        const {oldPassword, newPassword} = req.body;
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

const forgotPasswordController = async (req, res) => {
    try {
        const {email} = req.body;
        await authService.forgotPassword(email);
        res.status(200).json({
            status: "success",
            message: "Password reset link sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const {email, otp, newPassword} = req.body;
        await authService.resetPassword(email, otp, newPassword);
        res.status(200).json({
            status: "success",
            message: "Password reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const enable2FAController = async (req, res) => {
    try {
        const userId = req.userId;
        const otpUrl = await authService.get2faQRCodeForUser(userId);

        res.status(200).json({
            status: "success",
            message: "2FA enabled successfully",
            data: otpUrl
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

const disable2FAController = async (req, res) => {
    try {
        const userId = req.userId;
        await authService.disable2FA(userId);

        res.status(200).json({
            status: "success",
            message: "2FA disabled successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}


module.exports = {
    registerController,
    loginController,
    refreshTokenController,
    confirmEmailController,
    changePasswordController,
    forgotPasswordController,
    resetPasswordController,
    enable2FAController,
    disable2FAController
};
