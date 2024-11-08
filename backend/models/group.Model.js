const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    avatarUrl: {
        type: String,
        default: "https://res.cloudinary.com/du4g4aoew/image/upload/v1730476669/uploads/yhmnx9gbhzpyxqeoeysu.webp",
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    maxMembers: {
        type: Number,
        required: true,
        default: 100,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("Group", groupSchema, "group");
