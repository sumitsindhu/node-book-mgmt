const statusCodes = require("http-status");
const model = require("../models/index");
const { Op } = require("sequelize");
const {
    tokenService,
    userService
  } = require("../services");
  const {
    isValidUser,
    capitalizeFirstChar
  } = require("../utils/helperFunctions");
  const { comparePassword, encryptValue } = require("../utils/passwordHashing");
  const ApiError = require("../utils/apiError");
  const apiResponse = require("../utils/apiResponse");
  const catchAsync = require("../utils/catchAsync");
  const { crud, negate } = require("../utils/messageHandler");

  class authController {
    login = catchAsync(async (req, res) => {
      let { email, password } = req.body;
      let user = await isValidUser(email);
  
      if (!user) {
        throw new ApiError(statusCodes.BAD_REQUEST, negate("User", "nf"));
      }
  
      if (!user.status) {
        throw new ApiError(statusCodes.BAD_REQUEST, negate("User", "ia"));
      }
      // verify password and create token
      if (password!=user.password){
        throw new ApiError(statusCodes.BAD_REQUEST, negate("User", "ia"));
      }
        if (user.password != null) {
        const token = await tokenService.generateAuthTokens(
          user,
          "1",
          "ACCESS",
          user.user_permissions
        );
        delete user["password"];
        token.user = user;
  
        res.send(apiResponse(crud("Logged in", "s"), token));
      } else {
        throw new ApiError(statusCodes.BAD_REQUEST, negate("Credentials", "iv"));
      }
    });
  
    logout = catchAsync(async (req, res) => {
      let dbTxn = await model.sequelize.transaction();
      let queryOptions = {
        where: {
          user_id: req.userData.id,
        },
        transaction: dbTxn,
      };
  
      // destroy user token
      let deleteUserToken = await tokenService.destroy(queryOptions);
  
      if (!deleteUserToken) {
        await dbTxn.rollback();
        throw new ApiError(statusCodes.BAD_REQUEST, negate("Credentials", "iv"));
      }
  
      await dbTxn.commit();
  
      return res.send(apiResponse(crud("Logged out", "s")));
    });
  
    changePassword = catchAsync(async (req, res) => {
      let { password, new_password } = req.body;
      if (
        password == null ||
        password == "" ||
        new_password == null ||
        new_password == ""
      ) {
        throw new ApiError(statusCodes.UNAUTHORIZED, negate("Password", "iv"));
      }
      let queryOptions = {
        where: {
          id: req.userData.id,
        },
      };
  
      let user = await userService.findOne(queryOptions);
      if (!user) {
        throw new ApiError(statusCodes.BAD_REQUEST, "User Not Found");
      }
  
      if (user.password!= password) {
        throw new ApiError(statusCodes.BAD_REQUEST, negate("Credentials", "iv"));
      }
  
      queryOptions = {
        where: {
          id: req.userData.id,
        },
      };
  
      // let requestBody = {
      //   password: encryptValue(new_password),
      // };
      let requestBody = {
        password: new_password,
      };
      user = await userService.update(requestBody, queryOptions);
  
      if (user[0] == 0) {
        throw new ApiError(statusCodes.BAD_REQUEST, crud("Password", "u", false));
      } else {
        res.send(apiResponse(crud("Password Changed", "s")));
      }
    });
  }
  
  module.exports = new authController();
