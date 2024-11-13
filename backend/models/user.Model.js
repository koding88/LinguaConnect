const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        gender: {
            type: Boolean,
            required: true,
        },
        birthday: {
            type: Date,
            required: true,
        },
        favoriteTopics: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Topic",
            },
        ],
        location: {
            type: String,
            default: "",
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["block", "unblock"],
            default: "unblock",
        },
        isVerify: {
            type: Boolean,
            default: false,
        },
        isEnable2FA: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema, "users");
