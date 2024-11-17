const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        default: '',
    },
    images: {
        type: Array,
        default: [],
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["public", "hidden"],
        default: "public",
    },
    report: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("Post", postSchema, "posts");
