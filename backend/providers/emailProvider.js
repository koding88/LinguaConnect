const nodemailer = require("nodemailer");
const {OAuth2Client} = require("google-auth-library");
const logger = require("../utils/loggerUtil")
const {
    readTemplate,
    renderTemplate,
    sendMail,
} = require("../utils/emailUtil");

// OAuth2
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_MAIL, process.env.GOOGLE_CLIENT_SECRET_MAIL);
client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN_MAIL});

// NodeMailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.SEND_MAIL_ACCOUNT,
        clientId: process.env.GOOGLE_CLIENT_ID_MAIL,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET_MAIL,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN_MAIL,
        accessToken: client.getAccessToken(),
    },
});

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const sendVerificationEmail = async ({email, full_name, token}) => {
    try {
        const template = readTemplate("verificationEmail.ejs");

        const html = renderTemplate(template, {full_name, token, BASE_URL});

        const mailOptions = {
            from: process.env.SEND_MAIL_ACCOUNT,
            to: email,
            subject: "Account Verification",
            html: html,
        };

        const info = await sendMail(transporter, mailOptions);

        logger.info("Verification email sent successfully", {
            email,
            response: info.response,
        });
    } catch (error) {
        logger.error("Error sending verification email", {
            email,
            error: error.message,
        });
        throw new Error(
            "Failed to send verification email. Please try again later."
        );
    }
};

const sendPasswordResetEmail = async ({email, full_name, token}) => {
    try {
        const template = readTemplate("passwordResetEmail.ejs");

        const html = renderTemplate(template, {email, full_name, token});

        const mailOptions = {
            from: process.env.SEND_MAIL_ACCOUNT,
            to: email,
            subject: "Reset Password",
            html: html,
        };

        const info = await sendMail(transporter, mailOptions);

        logger.info("Password reset email sent successfully", {
            email,
            response: info.response,
        });
    } catch
        (error) {
        logger.error("Error sending password reset email", {
            email,
            error: error.message,
        });
        throw new Error(
            "Failed to send password reset email. Please try again later."
        );
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};
