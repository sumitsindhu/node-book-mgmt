const statusCodes = require('http-status');
const ApiError = require('../utils/apiError');
const {  tokenService } = require('../services');

const verifyUserToken = async (req, res, next) => {
  res.lang = req.headers.lang ? req.headers.lang : 'en';
  const { authorization  } = req.headers;
  if(!authorization){
   return next(new ApiError(statusCodes.UNAUTHORIZED, statusCodes[statusCodes.UNAUTHORIZED]));
  }
  if(!authorization && authorization.split(' ')[0] === 'Bearer'){
    return next(new ApiError(statusCodes.UNAUTHORIZED, statusCodes[statusCodes.UNAUTHORIZED]));
  }
  const decoded = await tokenService.verifyToken(authorization.split(' ')[1]);
  if (!decoded){
    return next(new ApiError(statusCodes.UNAUTHORIZED, statusCodes[statusCodes.UNAUTHORIZED]));
  }
  // if (!decoded.status) {
  //   return next(new ApiError(statusCodes.UNAUTHORIZED, statusCodes[statusCodes.UNAUTHORIZED]));
  // }

  req.userData = {
    id: decoded.id,
    email: decoded.email,
    first_name: decoded.first_name,
    last_name: decoded.last_name,
    status: decoded.status
  };
  next();
};

module.exports = { 
  verifyUserToken
};