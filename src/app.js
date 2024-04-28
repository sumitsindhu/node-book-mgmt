const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const statusCodes = require('http-status');
const morgan = require('morgan');
const { createServer } = require('http');
const { errorConverter, errorHandler } = require('./middlewares/error');
const routesV1 = require('./routes/v1');
const ApiError = require('./utils/apiError');
const config = require('./config/config');
const morganConfig = require('./config/morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const xss = require('xss-clean');
const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
require('./models/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json'); // Path to your OpenAPI 3.0 document

// create express instance
const app = express();

if(config.env !== 'test') {
    app.use(morganConfig.successHandler);
    app.use(morganConfig.errorHandler);
}

// create a rotating write stream
let initialFileName = `access.log`;
let accessLogStream = rfs.createStream(initialFileName, {
  interval: '1d', // rotates at every midnight https://github.com/iccicci/rotating-file-stream#interval;
  path: path.join(__dirname, 'log'),
});

// setup the logger
app.use(
    morgan('combined', {
      stream: accessLogStream,
      skip(req, res) {
        return res.statusCode <= 500;
      },
    })
  );
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// parse json request body
app.use(express.json());

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());

// enable cors
let corsOptions;
if (config.env === 'development' || config.env === 'localhost') {
  corsOptions = config.developmentCORsOptions;
} else if (config.env === 'uat') {
  corsOptions = config.uatCORsOptions;
} else if (config.env === 'production') {
  corsOptions = config.productionCORsOptions;
}

app.options('*', cors());
app.use(cors(corsOptions));

// initialize server
const httpServer = createServer(app);

app.use(function (req, res, next) {
    next();
});

// // swagger configurations
// const swaggerSpecs = swaggerJsdoc(config.swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// app.get('/swagger.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpecs);
// });

// set security HTTP headers
app.use(helmet());

// use v1 api routes
app.use('/v1', routesV1);

// send 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(statusCodes.NOT_FOUND, statusCodes[statusCodes.NOT_FOUND]));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = httpServer;