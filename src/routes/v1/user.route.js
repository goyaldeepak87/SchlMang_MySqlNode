const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const authValidation = require('../../validations/auth.validation');
const userController = require('../../controllers/user.contrller');
const upload = require('../../config/uploadConfig');

const router = express.Router();

// superAdmin
router.post("/superadmin/create-user-email", validate(authValidation.registerUserEmail), auth(), userController.createUserEmail)






// router.get("/profile", validate(authValidation.logoutSchoolUser), auth(), userController.userProfile)
// router.post("/update-profile", auth(), upload.single('profile_picture'), userController.userUpadteProfile)

module.exports = router;