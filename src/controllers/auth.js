//auth.js
const SuccessResponse = require("../utils/success");
const ErrorResponse = require("../utils/error");
const { login, register } = require("../services/auth");

module.exports = {
  async login(req, res, next) {
    try {
      const loginUser = await login(req);
      return SuccessResponse(res, "Login successfull", loginUser, 200);
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },

  async register(req, res, next) {
    try {
      const userCollection = await register(req);
      return SuccessResponse(
        res,
        "User created successfully",
        userCollection,
        201
      );
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },
};
