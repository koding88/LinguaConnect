const groupModel = require('../models/group.Model');
const userModel = require('../models/user.Model');
const errorHandler = require('../utils/errorUtil');
const logger = require('../utils/loggerUtil');

const getAllGroups = async () => {
    try {
        const groups = await groupModel.find({})
            .populate('owner', 'username full_name')
            .populate('members', 'username full_name')
            .exec();

        if (!groups) {
            throw errorHandler(404, 'No groups found');
        }

        logger.info(`Successfully retrieved ${groups.length} groups`);
        return groups;
    } catch (error) {
        logger.error(`Error getting all groups: ${error.message}`);
        throw error
    }
}

const getOneGroup = async (groupId) => {
    try {
        const group = await groupModel.findOne({_id: groupId})
            .populate('owner', 'username full_name')
            .populate('members', 'username full_name')
            .exec();

        if (!group) {
            throw errorHandler(404, 'No group found');
        }

        return group;
    } catch (error) {
        logger.error(`Error getting group: ${error.message}`);
        throw error;
    }
}

const createGroup = async (groupData) => {
    try {
        // Destructure the input data
        const {name, description, maxMembers, userId: ownerId} = groupData;

        // Validate the owner
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Check for existing group
        const existingGroup = await groupModel.findOne({name});
        if (existingGroup) {
            throw errorHandler(409, 'Group already exists');
        }

        // Create a new group
        const group = new groupModel({
            name,
            description,
            owner: ownerId,
            members: [ownerId],
            maxMembers: maxMembers || 100,
        });

        // Save the group
        await group.save();

        return group;
    } catch (error) {
        logger.error(`Error creating group: ${error.message}`);
        throw error;
    }
};

const updateGroup = async (groupId, ownerId, groupData) => {
    try {
        // Validate the owner
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Check if the owner has permission to edit the group
        const group = await groupModel.findOne({_id: groupId, owner: ownerId});
        if (!group) {
            throw errorHandler(403, 'Access denied');
        }

        // Destructure the new group data
        const {name, description, maxMembers} = groupData;

        // Check for an existing group with the same name
        const existingGroup = await groupModel.findOne({name});
        if (existingGroup && existingGroup._id.toString() !== groupId) {
            throw errorHandler(409, 'Group already exists');
        }

        // Update the group
        const updatedGroup = await groupModel.findOneAndUpdate(
            {_id: groupId},
            {name, description, maxMembers},
            {new: true}
        );

        return updatedGroup;
    } catch (error) {
        logger.error(`Error updating group: ${error.message}`);
        throw error;
    }
};


const deleteGroup = async (groupId, ownerId) => {
    try {
        // Validate the owner
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Check if the owner has permission to delete the group
        const group = await groupModel.findOne({_id: groupId, owner: ownerId});
        if (!group) {
            throw errorHandler(403, 'Access denied');
        }

        // Delete the group
        await groupModel.deleteOne({_id: groupId});

        return {message: 'Group deleted successfully'};
    } catch (error) {
        logger.error(`Error deleting group: ${error.message}`);
        throw error;
    }
}

module.exports = {
    getAllGroups,
    getOneGroup,
    createGroup,
    updateGroup,
    deleteGroup
}