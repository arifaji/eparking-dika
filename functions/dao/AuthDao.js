const { authenticationBean } = require('../db/index');

class AuthDao {
  static insertToken(token) {
    return authenticationBean.create({
      token,
    });
  }

  static findToken(token) {
    return authenticationBean.findOne({
      where: { token },
    });
  }

  static deleteTolen(token) {
    return authenticationBean.destroy({
      where: { token },
    });
  }
}

module.exports = AuthDao;
