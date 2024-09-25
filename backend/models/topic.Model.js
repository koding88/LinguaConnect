const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const topicModel = mongoose.model("Topic", topicSchema, "topics");

module.exports = topicModel;