const postModel = require('../models/post.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const {postValidation} = require("../validations/postValidation");

const createPost = async (userId, postData) => {
    try {
        const {content} = postData;
        const {error} = postValidation({userId, content});
        if(error){
            throw errorHandler(400, `Validation Create Post: ${error.message}`);
        }

        const newPost = new postModel({
            content: postData.content,
            images: postData.images,
            user: userId
        });

        await newPost.save()
        return newPost

    } catch (error) {
        logger.error(`Error creating post: ${error.message}`);
        throw error
    }
}

module.exports = {createPost}