const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    gender: Joi.string().required(),
  }).unknown(true),
};

// const login = {
//   body: Joi.object().keys({
//     email: Joi.string().required(),
//     password: Joi.string().required(),
//   }),
// };

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value.split(" ")[0] !== "Bearer") {
          return helpers.message('Bearer JWT Allow');
        }
        return value;
      })
      .messages({
        'any.required': 'Bearer Token is required.',
        'any.invalid': 'Invalid Bearer Token.',
      }),
  }).unknown(true),
  body: Joi.object().keys({
    new_password: Joi.string().required().custom(password),
    old_password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

// School Management System validation
const registerSuperAdimn = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
  headers: Joi.object().keys({
    role: Joi.string().required(),
    // 'content-type': Joi.string().required(),
    // 'user-agent': Joi.string().required(),
    // accept: Joi.string().required(),
    // 'cache-control': Joi.string().required(),
    // 'postman-token': Joi.string().required(),
    // host: Joi.string().required(),
    // 'accept-encoding': Joi.string().required(),
    // connection: Joi.string().required(),
    // 'content-length': Joi.string().required(),
  }).unknown(true),
};

const registerAdimn = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    role: Joi.string().required(),
  }).unknown(true),
};

const registerEmpTeacher = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
    subject: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    role: Joi.string().required(),
  }).unknown(true),
};

const registerStudent = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().required(),
    address: Joi.string().required(),
    currentClass: Joi.string().required(),
    currentSection: Joi.string().required(),
    admissionDate: Joi.string().required(),
    rollNumber: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    role: Joi.string().required(),
  }).unknown(true),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    // role: Joi.string().required(),
  }),
  // headers: Joi.object().keys({
  //   role: Joi.string().required(),
  // }).unknown(true),
};


const headersRoleCheck = {
  headers: Joi.object().keys({
    deviceid: Joi.string().required(),
    devicetype: Joi.string().required(),
    devicename: Joi.string().required(),
    ipaddress: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value === "14.194.97.171a") {
          return helpers.message('This IP address is not allowed');
        }
        return value;
      })
      .messages({
        'any.required': 'ipAddress is required.',
        'any.invalid': 'Invalid ipAddress.',
      }),
  }).unknown(true),
};

const logoutSchoolUser = {
  headers: Joi.object().keys({
    authorization: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value.split(" ")[0] !== "Bearer") {
          return helpers.message('Bearer JWT Allow');
        }
        return value;
      })
      .messages({
        'any.required': 'Bearer Token is required.',
        'any.invalid': 'Invalid Bearer Token.',
      }),
  }).unknown(true),
};

const registerUserEmail = {
  body: Joi.object().keys({
    user_email: Joi.string().required(),
    user_role: Joi.string().required(),
    // role: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    role: Joi.string().required(),
    authorization: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value.split(" ")[0] !== "Bearer") {
          return helpers.message('Bearer JWT Allow');
        }
        return value;
      })
      .messages({
        'any.required': 'Bearer Token is required.',
        'any.invalid': 'Invalid Bearer Token.',
      }),
  }).unknown(true),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  registerSuperAdimn,
  registerAdimn,
  registerEmpTeacher,
  headersRoleCheck,
  logoutSchoolUser,
  registerUserEmail,
  registerStudent,
};
