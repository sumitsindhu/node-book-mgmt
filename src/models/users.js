'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      this.hasMany(models.tokens, { foreignKey: 'user_id'})
    //   this.hasMany(models.user_roles, { foreignKey: 'user_id'})
    //   this.hasMany(models.user_permissions, { foreignKey: 'user_id' })

    }
  }
  users.init({
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
    modelName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return users;
};