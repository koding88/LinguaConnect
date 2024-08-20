const bcrypt = require("bcryptjs");
const logger = require("./loggerUtil");

// Hash Password
exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        logger.error("Hash password error: ", error.message);
        throw new Error("Hash password error: ", error.message);
    }
};

// Compare Password
exports.comparePassword = async (password, hash) => {
    try {
        const passwordMatch = await bcrypt.compare(password, hash);
        return passwordMatch;
    } catch (error) {
        logger.error("Compare password error: ", error.message);
        throw new Error("Compare password error: ", error.message);
    }
};
