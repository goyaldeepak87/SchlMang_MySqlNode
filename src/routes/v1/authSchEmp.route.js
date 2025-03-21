const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();


// superAdmin

router.post('/superadmin/register', validate(authValidation.registerSuperAdimn), authController.register);

router.post('/login', validate(authValidation.loginSuperAdiman), authController.login);

router.post('/change-password', validate(authValidation.resetPassword), auth(), authController.resetPassword)

router.post('/user-delete', auth(), authController.deleteProfile)



// admin

router.post('/admin/register', validate(authValidation.registerAdimn), authController.register);

router.post('/login', validate(authValidation.loginSuperAdiman), authController.login);

router.post('/change-password', validate(authValidation.resetPassword), auth(), authController.resetPassword)

router.post('/user-delete', auth(), authController.deleteProfile)


//  teacherEmployee

router.post('/employee/register', validate(authValidation.registerSuperAdimn), authController.empRegister);

router.post('/login', validate(authValidation.loginSuperAdiman), authController.login);

router.post('/change-password', validate(authValidation.resetPassword), auth(), authController.resetPassword)

router.post('/user-delete', auth(), authController.deleteProfile)

module.exports = router;