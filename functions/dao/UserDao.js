const { nanoid } = require('nanoid');
const { userBean } = require('../db/index');

class UserDao {
  static insertUser(payload) {
    return userBean.create({
      id: `user-${nanoid(16)}`,
      ...payload,
      created_date: new Date(),
    });
  }

  static findUserByEmail(email) {
    return userBean.findOne({
      where: { email },
      attributes: ['id'],
    });
  }

  static findUser(email) {
    return userBean.findOne({
      where: { email },
      attributes: ['id', 'password'],
    });
  }

  static findUserById(id) {
    return userBean.findOne({
      where: { id },
      attributes: ['id'],
    });
  }
}

module.exports = UserDao;
