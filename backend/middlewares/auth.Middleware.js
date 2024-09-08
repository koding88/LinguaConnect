const { accessTokenVerify } = require("../utils/tokenUtil");
const logger = require("../utils/loggerUtil");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        const decoded = accessTokenVerify(token);
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        logger.error("Verify token error: ", error.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        logger.error("Check admin error: ", error.message);
        return res.status(403).json({ message: "Forbidden" });
    }
};

module.exports = { verifyToken, isAdmin };
