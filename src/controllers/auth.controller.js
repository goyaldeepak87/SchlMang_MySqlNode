const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, authService, tokenService } = require('../services');
const { generateAuthTokens } = require('../services/token.service');
const userMessages = require('../messages/userMessages');
const { UserEmail } = require('../models');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
    console.log("sdasdads",)
    const user = await userService.createUser(req.body, req.headers.role);
    res.sendJSONResponse({
        statusCode: httpStatus.CREATED,
        status: true,
        message: userMessages.USER_REGISTER,
        data: { result: user }
    });
});

const EmailAndRegister = catchAsync(async (req, res) => {
    const { email } = req.body;
    const role  = req.headers.role;
    console.log("role===?", role)
    const userEmail = await userService.checkEmailAndRegister(email, role);

    console.log("userEmail", userEmail)
    const user = await userService.createUser(req.body, req.headers.role);
    res.sendJSONResponse({
        statusCode: httpStatus.CREATED,
        status: true,
        message: userMessages.USER_REGISTER,
        data: { result: user }
    });
});

const empRegister = catchAsync(async (req, res) => {
    const { email } = req.body;
    const role  = req.headers.role;
    
    const userEmail = await userService.checkEmailAndRegister(email, role);

    const user = await userService.empcreateUser(req.body, req.headers.role);
    res.sendJSONResponse({
        statusCode: httpStatus.CREATED,
        status: true,
        message: userMessages.USER_REGISTER,
        data: { result: user }
    });
})


const stRegister = catchAsync(async (req, res) => {
    const { email } = req.body;
    const role  = req.headers.role;

    const userEmail = await userService.checkEmailAndRegister(email, role);
    
    const user = await userService.stcreateUser(req.body, req.headers.role);
    res.sendJSONResponse({
        statusCode: httpStatus.CREATED,
        status: true,
        message: userMessages.USER_REGISTER,
        data: { result: user }
    });
})


const login = catchAsync(async (req, res) => {

    const { email, password } = req.body
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const token = await generateAuthTokens(user)
    res.sendJSONResponse({
        statusCode: httpStatus.OK,
        status: true,
        message: userMessages.LOGIN_SUCCESS,
        data: { result: { user, token } },
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const userResetPassword = await authService.resetPassword(req.headers.authorization, req.body);
    res.sendJSONResponse({
        statusCode: httpStatus.OK,
        status: true,
        message: userMessages.RESET_PASSWORD,
        data: { result: { userResetPassword } },
    });
})

const deleteProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const userID = await tokenService.verifyTokenUserId(token);
        await authService.deleteUserProfile(userID.sub);
        res.sendJSONResponse({
            statusCode: httpStatus.OK,
            status: true,
            message: userMessages.DELETE_USER,
            data: { result: {} },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    EmailAndRegister,
    empRegister,
    stRegister,
    login,
    resetPassword,
    deleteProfile
};