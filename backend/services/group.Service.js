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
        const {name, description, userId: ownerId} = groupData;

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
        const {name, description} = groupData;

        // Check for an existing group with the same name
        const existingGroup = await groupModel.findOne({name});
        if (existingGroup && existingGroup._id.toString() !== groupId) {
            throw errorHandler(409, 'Group already exists');
        }

        // Update the group
        const updatedGroup = await groupModel.findOneAndUpdate(
            {_id: groupId},
            {name, description},
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

const limitGroupMembers = async (groupId, userId, maxMembers) => {
    try {
        // Check if the group exists
        const group = await groupModel.findById(groupId);
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the owner exists
        const owner = await userModel.findById(userId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Verify the owner has permission to limit the group's members
        const groupOwnedByUser = await groupModel.findOne({_id: groupId, owner: userId});
        if (!groupOwnedByUser) {
            throw errorHandler(403, 'Access denied');
        }

        // Update the maximum number of members allowed in the group
        await groupModel.updateOne({_id: groupId}, {$set: {maxMembers}});

        return group
    } catch (error) {
        logger.error(`Error limiting group members: ${error.message}`);
        throw error;
    }
};

const removeGroupMember = async (groupId, ownerId, memberId) => {
    try {
        // Check if the group exists
        const group = await groupModel.findById(groupId);
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Validate the owner exists
        const owner = await userModel.findById(ownerId);
        if (!owner) {
            throw errorHandler(404, 'Owner not found');
        }

        // Verify the owner has permission to remove a member
        const ownerOfGroup = await groupModel.findOne({ _id: groupId, owner: ownerId });
        if (!ownerOfGroup) {
            throw errorHandler(403, 'Access denied');
        }

        // Check if the member exists
        const member = await userModel.findById(memberId);
        if (!member) {
            throw errorHandler(404, 'Member not found');
        }

        // Check if the member is part of the group
        const isMemberOfGroup = await groupModel.findOne({ _id: groupId, members: memberId });
        if (!isMemberOfGroup) {
            throw errorHandler(409, 'Member is not a member of the group');
        }

        // Remove the member from the group
        await groupModel.updateOne({ _id: groupId }, { $pull: { members: memberId } });

        return { message: 'Member removed successfully' };
    } catch (error) {
        logger.error(`Error removing member: ${error.message}`);
        throw error;
    }
};



const joinGroup = async (groupId, userId) => {
    try {
        // Validate the user
        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Check if the user is already a member of the group
        const existingMembership = await groupModel.findOne({_id: groupId, members: userId});
        if (existingMembership) {
            throw errorHandler(409, 'User is already a member of the group');
        }

        // Retrieve the group data to check the member limit
        const group = await groupModel.findById(groupId);
        if (!group) {
            throw errorHandler(404, 'Group not found');
        }

        // Check if the group has reached the maximum number of members
        if (group.members.length >= group.maxMembers) {
            throw errorHandler(403, 'Group has reached maximum number of members');
        }

        // Add the user to the group
        await groupModel.updateOne({_id: groupId}, {$push: {members: userId}});

        return {message: 'User joined group successfully'};
    } catch (error) {
        logger.error(`Error joining group: ${error.message}`);
        throw error;
    }
};


const leaveGroup = async (groupId, userId) => {
    try {
        // Validate the user
        const user = await userModel.findById(userId);
        if (!user) {
            throw errorHandler(404, 'User not found');
        }

        // Check user == owner
        const group = await groupModel.findOne({_id: groupId, owner: userId});
        if (group) {
            throw errorHandler(403, 'Owner cannot leave group');
        }

        // Check if the user is a member of the group
        const membership = await groupModel.findOne({_id: groupId, members: userId});
        if (!membership) {
            throw errorHandler(409, 'User is not a member of the group');
        }

        // Remove the user from the group
        await groupModel.updateOne({_id: groupId}, {$pull: {members: userId}});

        return {message: 'User left group successfully'};
    } catch (error) {
        logger.error(`Error leaving group: ${error.message}`);
        throw error;
    }
};

module.exports = {
    getAllGroups,
    getOneGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    limitGroupMembers,
    removeGroupMember,
    joinGroup,
    leaveGroup,
}