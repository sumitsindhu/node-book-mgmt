/*
 * Copper Digital Inc
 * Copyright (c) 2023-Present Copper Digital
 * Contact at copper digital dot com
 */

const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route');
const bookRoute = require('./book.route');

const defaultRoutes = [
  { 
    path: '/auth',
    route: authRoute
  },
  {
    path: '/book',
    route: bookRoute
  }

];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
