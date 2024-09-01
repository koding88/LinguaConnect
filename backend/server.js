const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoDB = require("./config/db");
const redis = require("./config/redis");
const cors = require("cors");
const { redisClient } = require("./config/redis");
const logger = require("./utils/loggerUtil");
require("dotenv").config();

const app = express();
// Cors
app.use(cors());

// Create server
const server = http.createServer(app);

// Body parser
app.use(bodyParser.json());

// Routes v1
const authRoute = require("./routes/v1/auth.Route");

app.use("/api/v1/auth", authRoute);

// Connect MongoDB
mongoDB.connectMongoDB();

// Redis
redis.connectRedisDB();

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
