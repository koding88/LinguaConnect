const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    url: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: [
            // User notifications
            "post_like", // Like bài viết
            "post_comment", // Comment bài viết
            "comment_like", // Like comment
            "group_post_like", // Like bài viết trong group
            "group_post_comment", // Comment bài viết trong group
            "group_comment_like", // Like comment trong group
            "follow", // Follow người khác
            "group_join", // Tham gia nhóm

            // Admin notifications
            "admin_post_report", // Tố cáo bài viết
            "admin_group_post_report", // Tố cáo bài viết trong nhóm
            "admin_group_created", // Tạo nhóm mới
            "admin_user_registered", // Đăng ký tài khoản mới
        ],
        required: true,
    },
    isRead: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const notificationModel = mongoose.model("Notification", notificationSchema, "notifications");

module.exports = notificationModel;
