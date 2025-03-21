const { User, Token } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { hashPassword } = require('../utils/bcryptUtils');

const createUser = async (userBody, role) => {
    const emailTaken = await User.findOne({ where: { role: role } });
    if (emailTaken) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already taken');
    }
    const user = await User.create({...userBody, role});
    return { user };
};

const empcreateUser = async (userBody) => {
    const emailTaken = await User.findOne({ where: { email: userBody.email } });      
} 

const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

const getUserById = async (id) => {
    return User.findOne({ where: { uuid: id } });
};

const updateUserByPassword = async (userId, new_password) => {
    const password = await hashPassword(new_password)

    const updatedUser = await User.update(
        { password: password }, // Set the new password (hashed)
        { where: { uuid: userId } } // Update user with the provided userId
    );
    return updatedUser;
};

const userProfileUpdate = async (req, userID) => {
    try {
        const {
            name,
            email,
            dob,
            phone_number,
            gender,
        } = req.body;

        // Handle the profile picture upload if exists
        let profile_picture = req.file ? req.file.filename : null;

        // Prepare the update object
        const updatedFields = {};

        // Only update provided fields
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (dob) updatedFields.dob = dob;
        if (phone_number) updatedFields.phone_number = phone_number;
        if (gender) updatedFields.gender = gender;
        if (profile_picture || profile_picture == null) updatedFields.profile_picture = profile_picture;

        // Check if there are fields to update
        if (Object.keys(updatedFields).length === 0) {
            throw new Error('No fields provided for update');
        }

        // Update the user in the database
        const [updatedCount] = await User.update(updatedFields, {
            where: { uuid: userID.sub },
            returning: true // Ensure you get the updated user back
        });

        if (updatedCount === 0) {
            throw new Error('No user found or no changes made');
        }

        // Fetch the updated user data
        const updatedUser = await User.findOne({ where: { uuid: userID.sub } });

        // Return the updated user profile
        return updatedUser;

    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('An error occurred while updating the profile');
    }
};

module.exports = { createUser, getUserByEmail, getUserById, updateUserByPassword, userProfileUpdate };
