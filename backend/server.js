const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoDB = require("./config/db");
const redis = require("./config/redis");
const cors = require("cors");
const passport = require("./config/passport");
const { redisClient } = require("./config/redis");
const logger = require("./utils/loggerUtil");
const errorMiddleware = require("./middlewares/error.Middleware");
require("dotenv").config();

const app = express();
// Cors
app.use(cors(
    {
        origin: "*"
    }
));

// Create server
const server = http.createServer(app);

// Body parser
app.use(bodyParser.json());

// Passport
app.use(passport.initialize());

// Ejs template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes v1
const authRoute = require("./routes/v1/auth.Route");
const userRoute = require("./routes/v1/user.Route");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

// Route test login google
app.get("/", (req, res) => {
    res.send('<a href="/api/v1/auth/google">Authenticate with google</a>');
});

// Error handler
app.use(errorMiddleware);

// Connect MongoDB
mongoDB.connectMongoDB();

// Redis
redis.connectRedisDB();

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
