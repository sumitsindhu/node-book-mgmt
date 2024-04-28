const express =require('express');
const {authController} = require("../../controllers/index");
const { verifyRestAPIKey } = require('../../middlewares/validate-rest-api-key');
const jwtVerify = require('../../middlewares/verify-token');
const router = express.Router();
const authValidation = require('../../validations/auth.validation');
const validate = require('../../middlewares/validate');

router.post('/login',  validate(authValidation.login), authController.login);

router.post('/change-password',  validate(authValidation.changePassword), jwtVerify.verifyUserToken ,authController.changePassword);

router.get('/logout', jwtVerify.verifyUserToken , authController.logout);
module.exports = router;