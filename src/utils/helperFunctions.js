const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const { userService } = require("../services");
const ApiError = require("./apiError");
const { comparePassword } = require("./passwordHashing");
const statusCodes = require("http-status");
const { crud } = require("./messageHandler");
const model = require("../models/index");
const config = require("../config/config");


const isValidUser = async (email) => {
    let queryOptions = {
      attributes: ["id", "password", "first_name", "last_name", "status"],
      where: {
        email: { [Op.iLike]: `${email}` },
      },
    };
  
    let findUser = await userService.findOne(queryOptions);
    return findUser;
  };
  
  const checkHashedPassword = async (password, last_name) => {
    let queryOptions;
    queryOptions = {
      attributes: ["password"],
      where: {
        last_name: { [Op.iLike]: last_name },
        app_id: 2,
      },
    };
  
    let allUsers = await userService.findAll(queryOptions);
  
    if (allUsers.length > 0) {
      for (let user of allUsers) {
        if (comparePassword(user.password, password)) {
          throw new ApiError(statusCodes.BAD_REQUEST, crud("User", "c", false));
        }
      }
    }
  
    return false;
  };
  
  const extractUserFromLastNameAndPass = async (password, last_name) => {
    let queryOptions;
    queryOptions = {
      attributes: ["id", "first_name", "last_name", "password", "status"],
      where: {
        last_name: { [Op.iLike]: last_name },
        app_id: 2,
      },
      include: [
        {
          model: model.token,
        },
      ],
    };
  
    let allUsers = await userService.findAll(queryOptions);
  
    if (allUsers.length > 0) {
      for (let user of allUsers) {
        if (comparePassword(user.password, password)) {
          currentUser = user;
          return user;
        }
      }
    }
  
    return false;
  };
  
  const emailExists = async (email) => {
    let queryOptions = {
      where: {
        email,
      },
    };
  
    let user = await userService.findOne(queryOptions);
  
    return user;
  };
  const capitalizeFirstChar = (name)=> {
    return (name)?name.charAt(0).toUpperCase() + name.slice(1):'';
  }

  module.exports = {
    isValidUser,
    checkHashedPassword,
    extractUserFromLastNameAndPass,
    emailExists,
    capitalizeFirstChar
  };