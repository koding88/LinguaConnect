const { accessTokenVerify } = require("../utils/tokenUtil");
const userModel = require("../models/user.Model");
const logger = require("../utils/loggerUtil");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        const decoded = accessTokenVerify(token);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        logger.error("Verify token error: ", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin privileges are required" });
        }
        next();
    } catch (error) {
        logger.error("Check admin error: ", error);
        return res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};

module.exports = { verifyToken, isAdmin };
