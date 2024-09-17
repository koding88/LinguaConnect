const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const handleMulterError = require("../utils/multerUtil");
const logger = require("../utils/loggerUtil");

// Create Optimize and Transform Image
const getCloudinaryOptions = () => {
    return {
        resource_type: "auto",
        folder: "uploads",
        transformation: [
            {quality: "auto", fetch_format: "auto"},
        ],
    };
};

exports.uploadImages = (req, res, next) => {
    upload.array("files")(req, res, (err) => {
        if (err) return handleMulterError(err, res, upload.limits);
        if (!req.files || req.files.length === 0)
            return res.status(400).json({error: "No files uploaded"});

        // Extract the file URLs from the request object
        const fileUrls = req.files.map(file => file.path);
        req.fileUrls = fileUrls;
        next();
    });
};

exports.uploadImagesToCloudinary = (req, res, next) => {
    upload.array("files")(req, res, async (err) => {
        if (err) {
            logger.error("Multer Error: ", err);
            return handleMulterError(err, res, upload.limits);
        }

        // if (!req.files || req.files.length === 0) {
        //     return res.status(400).json({error: "No files uploaded"});
        // }

        try {
            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload(file.path, getCloudinaryOptions(), (error, result) => {
                            fs.unlink(file.path, (unlinkErr) => {
                                if (unlinkErr) {
                                    logger.error("Failed to delete local file: ", unlinkErr);
                                }
                            });

                            if (error) {
                                logger.error("Cloudinary Error: ", error);
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        });
                });
            });

            const urls = await Promise.all(uploadPromises);
            req.fileUrls = urls;
            next();
        } catch (error) {
            logger.error("Upload to Cloudinary Failed: ", error);

            req.files.forEach(file => {
                fs.unlink(file.path, (unlinkErr) => {
                    if (unlinkErr) {
                        logger.error("Failed to delete local file: ", unlinkErr);
                    }
                });
            });

            res.status(500).json({error: error.message});
        }
    });
};