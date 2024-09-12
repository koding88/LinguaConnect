const multer = require("multer");

const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(0);

const handleMulterError = (err, res, limits) => {
    const fileSizeMB = bytesToMB(limits.fileSize);
    const maxFiles = limits.files;
    let errorMessage = "An error occurred during file upload";

    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                errorMessage = `File size exceeds the limit of ${fileSizeMB}MB`;
                break;
            case "LIMIT_FILE_COUNT":
                errorMessage = `Too many files. The maximum number of files is ${maxFiles}`;
                break;
            case "LIMIT_FIELD_KEY":
                errorMessage = "Field name exceeds the limit";
                break;
            default:
                errorMessage = "Multer error occurred";
        }
        return res.status(400).json({ error: errorMessage });
    }
    return res.status(400).json({ error: "Invalid file format" });
};

module.exports = handleMulterError;
