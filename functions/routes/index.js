const express = require('express');
const error = require('../middleware/error');
// const user = require('./users');
// const auth = require('./auth');
const test = require('./test');
const dika = require('./dika');

module.exports = (app) => {
  app.use(express.json());
  app.use('/.netlify/functions/api', test);
  // app.use('/.netlify/functions/api', user);
  // app.use('/.netlify/functions/api', auth);
  app.use('/.netlify/functions/api', dika);
  app.use(error);
};
