const ClientError = require('../exceptions/ClientError');
const logger = require('../util/logger');

module.exports = (err, req, res, next) => {
  if (err instanceof ClientError) {
    const response = {
      status: 'fail',
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return res.end();
  }
  if (err instanceof Error) {
    logger.debug(err.message);
    const response = {
      status: 'fail',
      message: err.message,
    };
    res.status(500).json(response);
    return res.end();
  }
  return null;
};
