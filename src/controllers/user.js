//auth.js
const SuccessResponse = require("../utils/success");
const ErrorResponse = require("../utils/error");
const User = require("../models/User");

const {
  withdrawFunds,
  transferFunds,
  getAllUsers,
  getLoggedinUser,
  getUserTransactions,
  verifyEmail,
  getAUser
} = require("../services/user");

module.exports = {
  async getAllUsers(req, res, next) {
    try {
      const userCollection = await getAllUsers();

      return SuccessResponse(
        res,
        "Users retrieved successfully",
        userCollection,
        200
      );
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },

  async getUser(req, res, next) {
    try {
      const userCollection = await getAUser(req.userId);

      return SuccessResponse(
        res,
        "User retrieved successfully",
        userCollection,
        200
      );
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },

  async getUserTransactions(req, res, next) {
    try {
      const userTransactions = await getUserTransactions(req.user.id);

      return SuccessResponse(
        res,
        "User transactions retrieved successfully",
        userTransactions,
        200
      );
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },

  async getLoggedinUser(req, res, next) {
    try {
      const userCollection = await getLoggedinUser(req);

      return SuccessResponse(res, "Profile details", userCollection, 200);
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },

  async withdrawFunds(req, res, next) {
    try {
      const { withdrawalAmount } = req.body;
      // const user = await User.findOne({ id: req.user._id });
      const withdraw = await withdrawFunds(req.user._id, +withdrawalAmount);
      if (withdraw) {
        return SuccessResponse(
          res,
          "Withdraw completed successfully",
          withdraw,
          201
        );
      }
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },

  async transferFunds(req, res, next) {
    try {
      const { transferAmount, recipient } = req.body;
      // const user = await User.findOne({ id: req.user._id });
      // const recipient = await User.findOne({id:req.body.recipient})
      const transfer = await transferFunds(
        req.user._id,
        recipient,
        +req.body.transferAmount
      );
      return SuccessResponse(
        res,
        "Transfer completed successfully",
        transfer,
        201
      );
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const { email } = req.body;
      const userCollection = await verifyEmail(email);

      return SuccessResponse(
        res,
        "Email verified successfully",
        userCollection,
        200
      );
    } catch (e) {
      return next(new ErrorResponse(e.message, e.statusCode));
    }
  },
};
