const multer = require('multer');
const path = require('path');
const cloudinary = require('./cloudinary');
const fs = require('fs');

const ensureUploadFolderExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadFolderPath = path.join(__dirname, "../uploads");
        ensureUploadFolderExists(uploadFolderPath);
        callback(null, uploadFolderPath);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = file.fieldname + "-" + uniqueSuffix + fileExtension;
        callback(null, fileName);
    }
});

const fileFilter = (req, file, callback) => {
    const supportedFiles = ["image/jpeg", "image/png", "image/jpg"];
    if (supportedFiles.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Unsupported file format"), false);
    }
};

const limits = {
    fileSize: 1024 * 1024 * 10, // 10mb
    files: 5,
    fileFilter: fileFilter,
}

const upload = multer({storage: storage, limits: limits});

module.exports = upload;