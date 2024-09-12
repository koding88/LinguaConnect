const userModel = require('../models/user.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const {IdValidation} = require("../validations/adminValidation");

const projection = {_id: 0, password: 0};

const getAllUsers = async () => {
    try {
        return await userModel.find({role: 'user'}, projection).exec();
    } catch (error) {
        logger.error(`Error in getAllUsers: ${error}`);
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const {error} = IdValidation({id});
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const user = await userModel.findById(id, projection).exec();
        if (!user) {
            throw errorHandler(404, `User with ID ${id} not found`);
        }

        return user;
    } catch (error) {
        logger.error(`Error fetching user with ${id}:`, error);
        throw error;
    }
};

const lockUserById = async (id) => {
    try {
        const {error} = IdValidation({id});
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const user = await userModel.findById(id).exec();

        if (!user) {
            throw errorHandler(404, `User with ID ${id} not found`);
        }

        if (user.status === "block") {
            throw errorHandler(400, `User with ID ${id} is already locked`);
        }

        user.status = "block";
        await user.save();
        return user

    } catch (error) {
        logger.error(`Error locking user with ID ${id}:`, error);
        throw error;
    }
}

const unlockUserById = async (id) => {
    try {
        const {error} = IdValidation({id});
        if (error) {
            logger.error(`Error validating ID: ${error.message}`);
            throw errorHandler(400, error.message);
        }

        const user = await userModel.findById(id).exec();

        if (!user) {
            throw errorHandler(404, `User with ID ${id} not found`);
        }

        user.status = "unblock";
        await user.save();
        return user

    } catch (error) {
        logger.error(`Error unlocking user with ID ${id}:`, error);
        throw error;
    }
}



module.exports = {getAllUsers, getUserById, lockUserById, unlockUserById}