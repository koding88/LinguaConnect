const cloudinary = require("../config/cloudinary");
const logger = require("../utils/loggerUtil");

// Delete Images
exports.deleteImages = async (urlImages) => {
    const deletedUrls = []; // Array to store successfully deleted URLs
    const failedUrls = []; // Array to store URLs that failed to delete

    try {
        // Ensure urlImages is an array
        if (!Array.isArray(urlImages)) {
            throw new Error('Invalid input: urlImages should be an array.');
        }

        // Extract public IDs from image URLs
        const publicIds = urlImages.map(url => {
            const publicId = extractPublicId(url);
            if (publicId) {
                return `uploads/${publicId}`;
            } else {
                failedUrls.push(url);
                return null;
            }
        }).filter(id => id !== null); // Filter out invalid public IDs

        if (publicIds.length === 0) {
            throw new Error('No valid public IDs to delete.');
        }

        // Perform batch deletion
        const result = await cloudinary.api.delete_resources(publicIds, { invalidate: true });

        // Process the result to determine which URLs were successfully deleted
        publicIds.forEach(id => {
            if (result.deleted[id]) {
                deletedUrls.push(urlImages[publicIds.indexOf(id)]);
            } else {
                failedUrls.push(urlImages[publicIds.indexOf(id)]);
            }
        });

        // Log warnings if some URLs could not be deleted
        if (failedUrls.length > 0) {
            logger.warn(`Failed to delete the following URLs: ${failedUrls.join(', ')}`);
        }

        return { deletedUrls, failedUrls };
    } catch (error) {
        // Log the error for debugging purposes
        logger.error(`Error deleting images: ${error.message}`);
        // Return an appropriate error message
        return { error: error.message };
    }
};

// Helper function to extract public ID from the image URL
const extractPublicId = (url) => {
    try {
        const parts = url.split('/');
        const fileName = parts.pop();
        const publicId = fileName.split('.')[0];
        return publicId;
    } catch (error) {
        logger.error(`Error extracting public ID: ${error.message}`);
        return null;
    }
};
