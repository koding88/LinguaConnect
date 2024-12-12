const authService = require("../services/auth.Service");
const passport = require("../config/passport");

const registerController = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await authService.register(userData);
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const loginController = async (req, res, next) => {
    try {
        const { identifier, password, otp } = req.body;

        // Call login service to authenticate user
        const {accessToken, refreshToken, user} = await authService.login(identifier, password, otp);

        // Respond with tokens if login is successful
        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: {
                user,
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

const loginGoogleController = passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
});


const loginGoogleRedirectController = (req, res, next) => {
    passport.authenticate("google", {session: false}, async (err, token) => {
        if (err) {
            return next(err);
        }

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Authentication failed",
            });
        }

        const {accessToken, refreshToken} = token;

        res.redirect(
            `${process.env.CLIENT_URL}/login/oauth?access_token=${accessToken}&refresh_token=${refreshToken}`
        )
    })(req, res, next);
};


const refreshTokenController = async (req, res, next) => {
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
        next(error);
    }
};

const confirmEmailController = async (req, res, next) => {
    try {
        console.log("confirmEmailController");
        const {token} = req.query;
        const full_name = await authService.confirmEmail(token);
        const loginUrl = `${process.env.CLIENT_URL}/login`;

        res.render("confirmation", {
            full_name,
            loginUrl,
        });
    } catch (error) {
        res.render("error");
        next(error)
    }
};

const changePasswordController = async (req, res, next) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const userId = req.userId;
        await authService.changePassword(userId, oldPassword, newPassword);
        res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
};

const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        res.status(200).json({
            status: "success",
            message: "Password reset OTP sent successfully",
        });
    } catch (error) {
        next(error);
    }
};

const resetPasswordController = async (req, res, next) => {
    try {
        const { email, otp } = req.query;
        const { newPassword } = req.body;

        await authService.resetPassword(email, otp, newPassword);
        res.status(200).json({
            status: "success",
            message: "Password reset successfully",
        });
    } catch (error) {
        next(error);
    }
};

const enable2FAController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const otpUrl = await authService.get2faQRCodeForUser(userId);

        res.status(200).json({
            status: "success",
            message: "2FA enabled successfully",
            data: otpUrl
        });
    } catch (error) {
        next(error)
    }
}

const disable2FAController = async (req, res, next) => {
    try {
        const userId = req.userId;
        await authService.disable2FA(userId);

        res.status(200).json({
            status: "success",
            message: "2FA disabled successfully"
        });
    } catch (error) {
        next(error)
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
    disable2FAController,
    loginGoogleRedirectController,
    loginGoogleController
};
