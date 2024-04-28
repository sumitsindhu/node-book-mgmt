'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: 'user_id',
      })
    }
  }
  tokens.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    type: DataTypes.STRING,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    freezeTableName: true,
    timestamps: true,
    modelName: 'tokens',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return tokens;
};