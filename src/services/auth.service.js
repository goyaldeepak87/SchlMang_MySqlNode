const tokenService = require('./token.service');
const userService = require('./user.service')
const { User, UserEmail, Student } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { tokenTypes } = require('../config/tokens');

// Function to handle login
// const loginUserWithEmailAndPassword = async (email, password) => {
//   // Find user by email and explicitly include password using the 'withPassword' scope
//   const user = await User.scope('withPassword').findOne({ where: { email, deletedAt: null } });

//   console.log("user==>111122222",  await User.findOne({ where: { email} }))

//   if (!user || !(await user.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//   }
//   return user;
// };

const loginUserWithEmailAndPassword = async (email, password) => {
  // Find user by email, including soft-deleted users
  const user = await User.scope('withPassword').findOne({
    where: { email },
    paranoid: false, // Include soft-deleted users
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  // Check if the user account is deactivated (soft-deleted)
  if (user.deletedAt) {
    await user.restore(); // Reactivate the account
  }

  // Verify password
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user; // Return the restored user
};


const stLoginUserWithEmailAndPassword = async (email, password) => {
  // Find user by email, including soft-deleted users
  console.log("email==>222", email, password)

  const stuser = await Student.scope('withPassword').findOne({
    where: { email },
    paranoid: false, // Include soft-deleted users
  });

  if (!stuser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  // Check if the user account is deactivated (soft-deleted)
  if (stuser.deletedAt) {
    await stuser.restore(); // Reactivate the account
  }

  // Verify password
  if (!(await stuser.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return stuser; // Return the restored user
};


const resetPassword = async (resetPasswordToken, password) => {
  const { old_password, new_password } = password
  console.log("password==>", password)
  // try {
  const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
  // const user = await userService.getUserById(resetPasswordTokenDoc.user_uuid);
  const user = await User.scope('withPassword').findOne({ where: { uuid: resetPasswordTokenDoc.user_uuid } });
  console.log("user==>", user)
  if (!user || !(await user.isPasswordMatch(old_password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  await userService.updateUserByPassword(user.uuid, new_password);
  // await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  // } catch (error) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  // }
}

const deleteUserProfile = async (userID) => {
  const user = await User.findOne({ where: { uuid: userID } });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Set the 'delete_requested_at' field to the current timestamp
  // user.delete_requested_at = new Date();
  // await user.save();
  await user.destroy()
}

module.exports = {
  loginUserWithEmailAndPassword,
  stLoginUserWithEmailAndPassword,
  resetPassword,
  deleteUserProfile
};
