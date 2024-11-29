const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');

const checkContent = async (content) => {
    try {
        // Validate input
        if (!content || typeof content !== 'string') {
            logger.warn('Invalid content provided for safety check');
            throw errorHandler(400, 'Invalid content provided');
        }

        // Trim content and check length
        const trimmedContent = content.trim();
        if (trimmedContent.length === 0) {
            logger.warn('Empty content provided for safety check');
            throw errorHandler(400, 'Content cannot be empty');
        }

        logger.info('Initiating content safety check');

        // Call Flask content safety service using fetch
        const response = await fetch(`${process.env.FLASK_APP_URL}/api/v1/check_content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: trimmedContent
            })
        });

        if (!response.ok) {
            logger.error(`Safety check service responded with status ${response.status}`);
            throw errorHandler(response.status, 'Safety check service error');
        }

        const result = await response.json();

        // Validate response structure
        if (!result || typeof result !== 'object') {
            logger.error('Invalid response format from safety check service');
            throw errorHandler(500, 'Invalid response from safety check service');
        }

        // Check response status
        if (result.status !== 'success' || !result.result || !('is_safe' in result.result)) {
            logger.error('Safety check service returned error:', result);
            throw errorHandler(500, 'Content safety check failed');
        }

        // Handle successful response
        const safetyResult = {
            isSafe: result.result.is_safe,
            violatedCategories: Array.isArray(result.result.violated_categories) 
                ? result.result.violated_categories 
                : []
        };

        logger.info('Content safety check completed successfully', {
            isSafe: safetyResult.isSafe,
            violations: safetyResult.violatedCategories
        });

        return safetyResult;

    } catch (error) {
        console.log(error);
        // Handle network errors
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            logger.error('Safety check service is unavailable');
            throw errorHandler(503, 'Safety check service is unavailable');
        }

        // Log the full error for debugging
        logger.error('Error checking content safety:', {
            error: error
        });

        // Return a generic error to the client
        throw errorHandler(500, 'Failed to check content safety');
    }
};

module.exports = { checkContent };