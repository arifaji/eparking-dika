const bcrypt = require('bcrypt');

const AuthDao = require('../dao/AuthDao');
const UserDao = require('../dao/UserDao');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../util/tokenManager');
const { validate } = require('../validator/validator');
const { validationSchema } = require('../util/enums');

class AuthenticationService {
  static async authenticate(payload) {
    const valid = validate(validationSchema.LOGIN_USER, payload);
    const { value } = valid;

    const user = await UserDao.findUser(value.email);
    if (!user) {
      throw new AuthenticationError('Incorrect Email / Password...');
    }
    const match = await bcrypt.compare(value.password, user.password);

    if (!match) {
      throw new AuthenticationError('Incorrect Email / Password...');
    }
    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    await AuthDao.insertToken(refreshToken);

    return { accessToken, refreshToken };
  }

  static async refresh(payload) {
    const valid = validate(validationSchema.REFRESH_TOKEN, payload);
    const { value } = valid;
    const { id } = verifyRefreshToken(value.refreshToken);
    const authToken = await AuthDao.findToken(value.refreshToken);
    if (!authToken) {
      throw new InvariantError('Invalid Refresh Token...');
    }
    const accessToken = generateAccessToken({ id });
    return accessToken;
  }

  static async delete(payload) {
    const valid = validate(validationSchema.REFRESH_TOKEN, payload);
    const { value } = valid;
    const { id } = verifyRefreshToken(value.refreshToken);
    await AuthDao.deleteTolen(value.refreshToken);
    return `Token ${id} deleted...`;
  }
}

module.exports = AuthenticationService;
