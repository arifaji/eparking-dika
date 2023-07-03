const _ = require('lodash');
const bcrypt = require('bcrypt');
const UserDao = require('../dao/UserDao');
const InvariantError = require('../exceptions/InvariantError');
const { validate } = require('../validator/validator');
const { validationSchema } = require('../util/enums');

class UserService {
  static async createUser(payload) {
    const valid = validate(validationSchema.INSERT_USER, payload);
    const { value } = valid;
    const existingEmail = await UserDao.findUserByEmail(value.email);
    if (existingEmail) {
      throw new InvariantError('email already exist...');
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);
    const user = await UserDao.insertUser({
      ...value,
      password: hashedPassword,
    });
    return _.pick(user, ['id']);
  }
}

module.exports = UserService;
