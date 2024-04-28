'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    static associate(models) {

    }
  }
  books.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    sequelize,
    paranoid: false,
    freezeTableName: true,
    timestamps: true,
    modelName: 'books',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return books;
};