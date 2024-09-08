const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/loggerUtil");

const readTemplate = (templateName) => {
    try {
        const folderTemplatePath = path.join(__dirname, "../email");
        const read_path = path.join(folderTemplatePath, templateName);
        return fs.readFileSync(read_path, "utf-8");
    } catch (error) {
        logger.error(`Failed to read email template ${templateName} : ${error.message}`);
        throw new Error(
            "Failed to read email template. Please check the logs for more details."
        );
    }
};

const renderTemplate = (template, data) => {
    try {
        return ejs.render(template, data);
    } catch (error) {
        logger.error(`Failed to render email template: ${error.message}`);
        throw new Error(
            "Failed to render email template. Please check the logs for more details."
        );
    }
};

const sendMail = async (transporter, mailOptions) => {
    try {
        logger.info("Sending email...", {to: mailOptions.to});
        const info = await transporter.sendMail(mailOptions);
        logger.info("Email sent successfully", {
            response: info.response,
            to: mailOptions.to,
        });
        return info;
    } catch (error) {
        logger.error("Failed to send email", {
            to: mailOptions.to,
            error: error.message,
        });
        throw new Error(
            "Failed to send email. Please check the logs for more details."
        );
    }
};

module.exports = {
    readTemplate,
    renderTemplate,
    sendMail,
};
