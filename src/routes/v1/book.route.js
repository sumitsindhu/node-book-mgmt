const express =require('express');
const {bookController} = require("../../controllers/index");
const { verifyRestAPIKey } = require('../../middlewares/validate-rest-api-key');
const jwtVerify = require('../../middlewares/verify-token');
const router = express.Router();
const bookValidation = require('../../validations/book.validation');
const validate = require('../../middlewares/validate');

router.get('/list', jwtVerify.verifyUserToken , validate(bookValidation.list), bookController.list);

router.post('/add', validate(bookValidation.add), jwtVerify.verifyUserToken ,bookController.add);

router.get('/authors', jwtVerify.verifyUserToken , bookController.authors);

router.get('/year',  jwtVerify.verifyUserToken , bookController.years);

router.get('/details',  jwtVerify.verifyUserToken ,validate(bookValidation.details), bookController.bookDetails);


router.put('/update',  validate(bookValidation.update), jwtVerify.verifyUserToken ,bookController.update);

router.delete('/remove', validate(bookValidation.remove), jwtVerify.verifyUserToken ,bookController.remove);

module.exports = router;