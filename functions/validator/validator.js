const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');
const { validationSchema } = require('../util/enums');

const schemas = {};
schemas[validationSchema.INSERT_USER] = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

schemas[validationSchema.LOGIN_USER] = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

schemas[validationSchema.REFRESH_TOKEN] = Joi.object({
  refreshToken: Joi.string().required(),
});

const validate = (schema, payload) => {
  if (schemas[schema]) {
    const validSchema = schemas[schema].validate(
      {
        ...payload,
      },
      { abortEarly: false }
    );
    if (validSchema.error) {
      throw new InvariantError(validSchema.error);
    }
    return validSchema;
  }
  throw new Error(`${schema} schema validaton not found...`);
};

module.exports = {
  validate,
};
