const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tokenTypes } = require('../config/tokens');
const { tokenService, fileService } = require('../services');
const { Token, User, Student } = require('../models');
const { userService } = require('../services');
const userMessages = require('../messages/userMessages');
const ApiError = require('../utils/ApiError');

const userProfile = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    const userID = await tokenService.verifyTokenUserId(token, tokenTypes.RESET_PASSWORD);

    const tokenData = await Token.findOne({
        where: { user_uuid: userID.sub },
        include: {
            model: User,
            // as: 'user',  // Alias for association (optional, can be left out)
            // attributes: [], // Only get necessary fields from the user
        }
    })
    res.sendJSONResponse({
        statusCode: httpStatus.OK,
        status: true,
        message: userMessages.USER_DATA_FEATCH,
        data: { result: tokenData.User },
    });
})

const userUpadteProfile = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    const userID = await tokenService.verifyTokenUserId(token);
    const user = await userService.userProfileUpdate(req, userID)
    res.sendJSONResponse({
        statusCode: httpStatus.OK,
        status: true,
        message: userMessages.USER_PROFILE_UPDATAED,
        data: { result: { user } },
    });
})

const createUserEmail = catchAsync(async (req, res) => {
    const token = req.headers.authorization;
    const userrole = req.headers.role;
    const userID = await tokenService.verifyTokenUserId(token);
    const tokenData = await Token.findOne({
        where: { user_uuid: userID.sub },
        // include: {
        //     model: User,
        //     where: { role: userrole },
        // }
        include: [
            { model: User, required: false },
            { model: Student, required: false },
          ],
    });

    if (!tokenData) {
        throw new ApiError(httpStatus.FORBIDDEN, 'User not found or role mismatch');
    }

    const user = tokenData.User;
    
    // Role-based restrictions
    const { user_role } = req.body;
    if (user.role === 'superadmin' && !['admin', 'teacher', 'student'].includes(user_role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Super admin can only register admin, teacher, or student');
    }
    if (user.role === 'admin' && !['teacher', 'student'].includes(user_role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Admin can only register teacher');
    }
    if (user.role === 'teacher' && user_role !== 'student') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Teacher cannot register any user');
    }
    
    console.log("user++", user_role)
    const userEmail = await userService.userEmailAdd(req.body, user.uuid);

    res.sendJSONResponse({
        statusCode: httpStatus.OK,
        status: true,
        message: userMessages.USER_EMAIL_ADD,
        data: { result: { userEmail } },
    });
})

module.exports = {
    userProfile,
    userUpadteProfile,
    createUserEmail,
}