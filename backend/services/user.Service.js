const userModel = require('../models/user.Model');
const logger = require('../utils/loggerUtil');
const errorHandler = require('../utils/errorUtil');
const {string} = require("joi");

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
        var user = await userModel.findById(id, projection).exec();
        if (!user) {
            throw errorHandler(404, `User ${user?.email} not found`);
        }

        return user;
    } catch (error) {
        logger.error(`Error fetching user ${user?.email}:`, error);
        throw error;
    }
};

const lockUserById = async (id) => {
    try {
        var user = await userModel.findById(id).exec();

        if (!user) {
            throw errorHandler(404, `User ${user?.email} not found`);
        }

        if(user.status === "block") {
            throw errorHandler(400, `User ${user?.email} is already locked`);
        }

        user.status = "block";
        await user.save();
        return user

    } catch (error) {
        logger.error(`Error locking user ${user?.email}:`, error);
        throw error;
    }
}

const unlockUserById = async (id) => {
    try {
        var user = await userModel.findById(id).exec();

        if (!user) {
            throw errorHandler(404, `User ${user?.email} not found`);
        }

        user.status = "unblock";
        await user.save();
        return user

    } catch (error) {
        logger.error(`Error unlocking user${user?.email}:`, error);
        throw error;
    }
}

module.exports = {getAllUsers, getUserById, lockUserById, unlockUserById}