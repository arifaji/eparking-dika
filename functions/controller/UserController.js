const response = require('../util/response');
const UserService = require('../service/UserService');

class UserController {
  static async createUser(req, res, next) {
    try {
      const payload = req.body;
      const user = await UserService.createUser(payload);
      return response.created({ res, data: { userId: user.id } });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UserController;
