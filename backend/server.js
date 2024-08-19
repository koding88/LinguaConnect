const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Routes


app.use(bodyParser.json());

// Connect MongoDB
connectDB();    

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
