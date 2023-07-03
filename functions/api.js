require('pg');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

// app.use('/.netlify/functions/api', router);
require('./routes')(app);

module.exports.handler = serverless(app);
