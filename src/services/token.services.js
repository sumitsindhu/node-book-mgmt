
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const model = require("../models");

//  * Generate token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {string} [secret]
//  * @returns {string}
//  */

const generateToken = (
  user_id,
  expires,
  type,
  role_id,
  permissions,
  secret = config.jwt.secret
) => {
  const payload = {
    id: user_id,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    role_id,
    permissions
  };
  return jwt.sign(payload, secret);
};

// /**
//  * Save a token
//  * @param {string} token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {boolean} [blacklisted]
//  * @returns {Promise<Token>}
//  */
const create = (data, queryOptions) => {
  return new Promise((resolve, reject) => {
    model.tokens
      .create(data, queryOptions)
      .then((result) => {
        result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
      })
      .catch((error) => {
        if (queryOptions && queryOptions.transaction) {
          queryOptions.transaction.rollback();
        }
        reject(error);
      });
  });
};

const update = (data, queryOptions) => {
  return new Promise((resolve, reject) => {
    model.tokens
      .update(data, queryOptions)
      .then((result) => {
        result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
      })
      .catch((error) => {
        if (queryOptions && queryOptions.transaction) {
          queryOptions.transaction.rollback();
        }
        reject(error);
      });
  });
};

const getToken = (condition) => {
  return new Promise((resolve, reject) => {
    model.tokens
      .findOne({
        where: condition,
        include: [
          {
            model: model.users,
            attributes: {
              exclude: ["password"],
            },
          },
        ],
      })
      .then((result) => {
        result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const destroy = (queryOptions) => {
  return new Promise((resolve, reject) => {
    model.tokens
      .destroy(queryOptions)
      .then((result) => {
        result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
      })
      .catch((error) => {
        if (queryOptions && queryOptions.transaction) {
          queryOptions.transaction.rollback();
        }
        reject(error);
      });
  });
};

//  * Verify token and return token doc (or throw an error if it is not valid)
//  * @param {string} token
//  * @param {string} type
//  * @returns {Promise<Token>}
//  */
const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, async (error, decoded) => {
      if (error) {
        return resolve(false);
      }
      if (decoded.type !== "ACCESS" && decoded.type !== "FORGOT") {
        return resolve(false);
      }
      const getTokenData = {
        token,
      };
      const tokenData = await getToken(getTokenData);
      if (!tokenData || !decoded?.id) {
        resolve(false);
      } else if (
        tokenData?.user?.id != decoded.id
      ) {
        resolve(false);
      } else {
        resolve(tokenData.user);
      }
    });
  });
};

// /**
//  * Generate auth tokens
//  * @param {User} user
//  * @returns {Promise<Object>}
//  */
const generateAuthTokens = async (user, role_id, type, permissions) => {
  // if any token exist of same user then delete the token
  // to enfore that user can only create one session
  let tokenExpires;
if(type === "FORGOT") {
  tokenExpires = moment().add(
    config.jwt.forgotExpirationDays,
    "days"
  );
}
if(type === "ACCESS") {
  tokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
}
if(type === "CREATE") {
  tokenExpires = moment().add(
    config.jwt.createExpirationMinutes,
    "days"
  );
}

  let queryOptions = {
    where: {
      user_id: user.id,
    },
  };

  // await destroy(queryOptions); 


  const token = generateToken(
    user.id,
    tokenExpires,
    type,
    role_id,
    permissions
  );

  const data = {
    user_id: user.id,
    token: token,
    type: type,
    expires_at: tokenExpires
  };
  await create(data);

  return {
    access: {
      token: token,
      expires: tokenExpires.toDate(),
    },
  };
};

const updateToken = (data, queryOptions) => {
  return new Promise((resolve, reject) => {
    model.tokens
      .update(data, queryOptions)
      .then((result) => {
        result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
      })
      .catch((error) => {
        if (queryOptions && queryOptions.transaction) {
          queryOptions.transaction.rollback();
        }
        reject(error);
      });
  });
};

module.exports = {
  generateToken,
  create,
  verifyToken,
  generateAuthTokens,
  destroy,
  getToken,
  updateToken,
  update
};
