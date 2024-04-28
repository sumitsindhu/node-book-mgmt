const Joi = require('joi');

const add = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        author: Joi.string().required(),
        year: Joi.string().required(),
    })
  };

  const list = {
    query: Joi.object().keys({
      limit: Joi.number().optional().allow('',null),
      offset: Joi.number().optional().allow('',null),
    //   order_by: Joi.number().optional().allow('',null),
    //   order_type: Joi.number().optional().allow('',null),
      title: Joi.string().optional().allow('',null),
      author: Joi.string().optional().allow('',null),
      year: Joi.string().optional().allow('',null),
    }),
  };

  const details = {
    query: Joi.object().keys({
      id: Joi.number().required()
    }),
  };

  const remove = {
    query: Joi.object().keys({
      id: Joi.number().required()
    }),
  };

  const update = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        author: Joi.string().required(),
        year: Joi.string().required(),
    })
  };

module.exports = { 
    add,
    list,
    details,
    remove,
    update

}