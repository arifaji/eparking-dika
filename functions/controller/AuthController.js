const response = require('../util/response');
const AuthenticationService = require('../service/AuthService');

class AuthController {
  static async postAuth(req, res, next) {
    try {
      const payload = req.body;
      const token = await AuthenticationService.authenticate(payload);
      return response.created({ res, data: token });
    } catch (error) {
      return next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const payload = req.body;
      const accessToken = await AuthenticationService.refresh(payload);
      return response.ok({ res, data: { accessToken } });
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const payload = req.body;
      const message = await AuthenticationService.delete(payload);
      return response.ok({ res, message });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthController;
