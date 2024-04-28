const model = require('../models');

class UserService {
  create(data, queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
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
  }

  findOne(queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
        .findOne(queryOptions)
        .then((result) => {
          result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  update(data, queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
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
  }

  findAll(queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
        .findAll(queryOptions)
        .then((result) => {
          result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  findAndCountAll(queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
        .findAndCountAll(queryOptions)
        .then((result) => {
          result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  destroy(queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
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
  }
  findAll(queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
        .findAll(queryOptions)
        .then((result) => {
          result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  count(queryOptions) {
    return new Promise((resolve, reject) => {
      model.users
        .count(queryOptions)
        .then((result) => {
          result ? resolve(JSON.parse(JSON.stringify(result))) : resolve(false);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  bulkCreate(data, queryOptions) {
      return new Promise((resolve, reject) => {
        model.users
          .bulkCreate(data, queryOptions)
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
    }
}
module.exports = new UserService();