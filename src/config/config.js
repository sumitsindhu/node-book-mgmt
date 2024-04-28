/*
 * Copper Digital Inc
 * Copyright (c) 2023-Present Copper Digital
 * Contact at copper digital dot com
 */

const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    // common config
    NODE_ENV: Joi.string().valid('production', 'uat', 'development', 'localhost'),
    PORT: Joi.number().default(3000),
    REST_API_KEY: Joi.string(),
    ENCRYPTION_KEY: Joi.string(),

    // database config
    DB_DEBUG: Joi.boolean().required(),
    DB_POOL_MAX: Joi.number().required().default(5),
    DB_POOL_MIN: Joi.number().required().default(0),
    DB_POOL_ACQUIRE: Joi.number().required(),
    DB_POOL_IDLE: Joi.number().required(),
    DB_DIALECT: Joi.string().required(),
    DB_PORT: Joi.number(),

    // local config
    LOCALHOST_DB_USER: Joi.string().required(),
    LOCALHOST_DB_PASSWORD: Joi.string().required(),
    LOCALHOST_DB_NAME: Joi.string().required(),
    LOCALHOST_DB_HOST: Joi.string().required(),
    LOCALHOST_APP_LINK: Joi.string().required(),

    // development config
    // DEVELOPMENT_DB_USER: Joi.string().required(),
    // DEVELOPMENT_DB_PASSWORD: Joi.string().required(),
    // DEVELOPMENT_DB_NAME: Joi.string().required(),
    // DEVELOPMENT_DB_HOST: Joi.string().required(),
    // DEVELOPMENT_APP_LINK: Joi.string().required(),

    // // uat config
    // UAT_DB_USER: Joi.string().required(),
    // UAT_DB_PASSWORD: Joi.string().required(),
    // UAT_DB_NAME: Joi.string().required(),
    // UAT_DB_HOST: Joi.string().required(),
    // UAT_APP_LINK: Joi.string().required(),
    
    // // production config
    // PRODUCTION_DB_USER: Joi.string().required(),
    // PRODUCTION_DB_PASSWORD: Joi.string().required(),
    // PRODUCTION_DB_NAME: Joi.string().required(),
    // PRODUCTION_DB_HOST: Joi.string().required(),
    // PRODUCTION_APP_LINK: Joi.string().required(),

    // javascript web token config
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_FORGOT_EXPIRATION_DAYS: Joi.number().default(30).description('days after which forgot tokens expire'),
    JWT_CREATE_EXPIRATION_DAYS: Joi.number().default(30).description('days after which create tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    
    // aws config
    // AWS_ACCESS_KEY_ID: Joi.string().required(),
    // AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    // AWS_DEFAULT_REGION: Joi.string().required(),
    // AWS_BUCKET: Joi.string().required(),
    // AWS_BUCKET_BASE_URL: Joi.string().required(),
    
    // // SMTP config
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    
    // // twilio config
    // TWILIO_ACCOUNT_SID: Joi.string(),
    // TWILIO_AUTH_TOKEN: Joi.string(),
    // TWILIO_PHONE_NUMBER: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apikey: envVars.REST_API_KEY,
  encryptionKey: envVars.ENCRYPTION_KEY,
  localhost: {
    username: envVars.LOCALHOST_DB_USER,
    password: envVars.LOCALHOST_DB_PASSWORD,
    database: envVars.LOCALHOST_DB_NAME,
    host: envVars.LOCALHOST_DB_HOST,
    port: envVars.DB_PORT,
    dialect: envVars.DB_DIALECT,
    link: envVars.LOCAL_APP_LINK,
  },
  development: {
    username: envVars.DEVELOPMENT_DB_USER,
    password: envVars.DEVELOPMENT_DB_PASSWORD,
    database: envVars.DEVELOPMENT_DB_NAME,
    host: envVars.DEVELOPMENT_DB_HOST,
    port: envVars.DB_PORT,
    dialect: envVars.DB_DIALECT,
    link: envVars.DEVELOPMENT_APP_LINK,
  },
  uat: {
    username: envVars.UAT_DB_USER,
    password: envVars.UAT_DB_PASSWORD,
    database: envVars.UAT_DB_NAME,
    host: envVars.UAT_DB_HOST,
    port: envVars.DB_PORT,
    dialect: envVars.DB_DIALECT,
    link: envVars.UAT_APP_LINK,
  },
  production: {
    username: envVars.PRODUCTION_DB_USER,
    password: envVars.PRODUCTION_DB_PASSWORD,
    database: envVars.PRODUCTION_DB_NAME,
    host: envVars.PRODUCTION_DB_HOST,
    port: envVars.DB_PORT,
    dialect: envVars.DB_DIALECT,
    link: envVars.PRODUCTION_APP_LINK,
  },
  dbConfig: {
    dialect: envVars.DB_DIALECT,
    debug: envVars.DB_DEBUG,
    pool: {
      max: parseInt(envVars.DB_POOL_MAX, 10),
      min: parseInt(envVars.DB_POOL_MIN, 10),
      acquire: parseInt(envVars.DB_POOL_ACQUIRE, 10),
      idle: parseInt(envVars.DB_POOL_IDLE, 10),
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    forgotExpirationDays: envVars.JWT_FORGOT_EXPIRATION_DAYS,
    createExpirationDays: envVars.JWT_CREATE_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  aws: {
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    awsDefaultRegion: envVars.AWS_DEFAULT_REGION,
    awsBucket: envVars.AWS_BUCKET,
    awsBucketBaseUrl: envVars.AWS_BUCKET_BASE_URL,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  twilio: {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
    phoneNumber: envVars.TWILIO_PHONE_NUMBER,
  },
  developmentCORsOptions: [
    'http://localhost:4200',
    'http://localhost:3000'
  ],
  uatCORsOptions: [
    'http://localhost:4200',
    'http://localhost:3000',
  ],
  productionCORsOptions: []
  
};
