const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoDB = require("./config/db");
const redis = require("./config/redis");
const passport = require("./config/passport");
const { app, server } = require("./sockets/sockets");
const logger = require("./utils/loggerUtil");
const errorMiddleware = require("./middlewares/error.Middleware");
require("dotenv").config();

// Body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Passport
app.use(passport.initialize());

// Ejs template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes v1
const authRoute = require("./routes/v1/auth.Route");
const adminRoute = require("./routes/v1/admin.Route");
const postRoute = require("./routes/v1/post.Route");
const commentRoute = require("./routes/v1/comment.Route");
const userRoute = require("./routes/v1/user.Route");
const groupRoute = require("./routes/v1/group.Route");
const messageRoute = require("./routes/v1/message.Route");
const notificationRoute = require("./routes/v1/notification.Route");
const stringeeRoute = require("./routes/v1/stringeeRoute");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/groups", groupRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/stringee", stringeeRoute);

// Error handler
app.use(errorMiddleware);

// Connect MongoDB
mongoDB.connectMongoDB();

// Redis
redis.connectRedisDB();

// Start server
const PORT = process.env.PORT || 5001;
const HOST = "0.0.0.0";
server.listen(PORT, HOST, () => {
    logger.info(`Server running on port ${PORT}, host ${HOST}`);
});
