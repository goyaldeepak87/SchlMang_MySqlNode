const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();


// superAdmin

router.post('/superadmin/register', validate(authValidation.registerSuperAdimn), authController.register);

router.post('/superadmin/login', validate(authValidation.login), authController.login);

router.post('/superadmin/change-password', validate(authValidation.resetPassword), auth(), authController.resetPassword)

router.post('/user-delete', auth(), authController.deleteProfile)



// admin

router.post('/admin/register', validate(authValidation.registerAdimn), authController.EmailAndRegister);

router.post('/admin/login', validate(authValidation.login), authController.login);

router.post('/admin/change-password', validate(authValidation.resetPassword), auth(), authController.resetPassword)

router.post('/user-delete', auth(), authController.deleteProfile)


//  teacherEmployee

router.post('/employee/register', validate(authValidation.registerEmpTeacher), authController.empRegister);

router.post('/employee/login', validate(authValidation.login), authController.login);

router.post('/employee/change-password', validate(authValidation.resetPassword), auth(), authController.resetPassword)

router.post('/user-delete', auth(), authController.deleteProfile)


//  student

router.post('/student/register', validate(authValidation.registerStudent), authController.stRegister);

router.post('/student/login', validate(authValidation.login), authController.stLogin);

router.post('/student/change-password', validate(authValidation.resetPassword), auth(), authController.resetPassword)

router.post('/user-delete', auth(), authController.deleteProfile)

module.exports = router;