const Joi = require('joi');

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
  };

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().required()
    })
  };

const createPassword = { 
    body: Joi.object().keys({ 
        password: Joi.string().required()
    })
}

const changePassword = { 
    body: Joi.object().keys({ 
        password: Joi.string().required(),
        new_password: Joi.string().required()
    })
}

module.exports = { 
    login,
    forgotPassword,
    createPassword,
    changePassword
}