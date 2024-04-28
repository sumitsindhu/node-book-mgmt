const statusCodes = require("http-status");
const model = require("../models/index");
const { Op } = require("sequelize");
const {
    tokenService,
    userService,
    BookService
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
  const Sequelize = require("sequelize");

  class bookController {
    add = catchAsync(async (req, res) => {
      let {
        year,
        title,
        author
      } = req.body;

      let requestBody = {
        year: year,
        title: title,
        author: author
      };

      let createBook = await BookService.create(requestBody)

      if (!createBook) {
        throw new ApiError(statusCodes.BAD_REQUEST, crud("Book", "c", false));
      }

      return res.send(apiResponse(crud("Book created", "s"), createBook));
    });

    list = catchAsync(async (req, res) => {
      let {
        limit,
        offset,
        title,
        author,
        year
      } = req.query;

      if (!offset) {
        offset = 0;
      }
      if (!limit) limit = 10;

      let queryOptions = {
        where: {},
        offset: offset,
        limit: limit
      }

      if (year) {
        Object.assign(queryOptions.where, { year: year });
      }

      if (title) {
        queryOptions.where = {
          [Op.or]: [
            Sequelize.where(
              Sequelize.col("title"),
              {
                [Op.iLike]: `%${title}%`,
              }
            ),
          ],
        };
      }

      if (author || year || title) {
        queryOptions.where = {
          [Op.and]: []
        };
      
        if (author) {
          queryOptions.where[Op.and].push(
            Sequelize.where(
              Sequelize.col("title"),
              {
                [Op.iLike]: `%${title}%`,
              }
            )
          );
        }
      
        if (year) {
          queryOptions.where[Op.and].push(
            Sequelize.where(
              Sequelize.col("year"),
              {
                [Op.iLike]: `%${year}%`,
              }
            )
          );
        }
      
        if (title) {
          queryOptions.where[Op.and].push(
            Sequelize.where(
              Sequelize.col("title"),
              {
                [Op.iLike]: `%${title}%`,
              }
            )
          );
        }
      }
      

      let allBooks = await BookService.findAll(queryOptions);

      return res.send(apiResponse(crud("Book fetched", "s"), allBooks));
    });

    authors = catchAsync(async (req, res) => {

      let queryOptions = {
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('author')), 'author']]
    };
    
    let distinctAuthors = await BookService.findAll(queryOptions);

      return res.send(apiResponse(crud("Authors fetched", "s"), distinctAuthors));
    });

    years = catchAsync(async (req, res) => {

      let queryOptions = {
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('year')), 'year']]
    };
    
    let distinctyears = await BookService.findAll(queryOptions);

      return res.send(apiResponse(crud("Authors fetched", "s"), distinctyears));
    });

    bookDetails = catchAsync(async (req, res) => {

      let queryOptions = {
        where: {id:req.query.id}
    };
    
    let getBook = await BookService.findAll(queryOptions);

      return res.send(apiResponse(crud("Authors fetched", "s"), getBook));
    });

    remove = catchAsync(async (req, res) => {

      let queryOptions = {
        where: {id:req.query.id}
    };
    
    let deleteBook = await BookService.destroy(queryOptions);

      return res.send(apiResponse(crud("Book deleted", "s"), deleteBook));
    });


    update = catchAsync(async (req, res) => {

      let {
        year,
        title,
        author
      } = req.body;

      let requestBody = {
        year: year,
        title: title,
        author: author
      };

      let queryOptions = {
        where: {id:req.query.id}
      }

      let updateBook = await BookService.update(requestBody,queryOptions)

      return res.send(apiResponse(crud("Book updated", "s"), updateBook));
    });
  

    
  }
  
  module.exports = new bookController();
