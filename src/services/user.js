const User = require("../models/User");
const _ = require("lodash");
const walletTransaction = require("../models/WalletTransaction");
const mongoose = require("mongoose");
const ErrorResponse = require("../utils/error");

module.exports = {
  /**
   * @returns {userCollection}
   */
  async getAllUsers() {
    try {
      const userCollection = await User.find({});
      return userCollection;
    } catch (e) {
      throw new ErrorResponse(e.message, e.statusCode);
    }
  },

  /**
   * @returns {userCollection}
   */
   async getAUser(user) {
    // await walletTransaction.find({ user: user });
    try {
      const userCollection = await User.findById(user);
      return userCollection;
    } catch (e) {
      throw new ErrorResponse(e.message, e.statusCode);
    }
  },

  /**
   * @returns {userTransactions}
   */
  async getUserTransactions(user) {
    try {
      const userTransactions = await walletTransaction.find({ user: user });
      return userTransactions;
    } catch (e) {
      throw new ErrorResponse(e.message, e.statusCode);
    }
  },

  /**
   *  @param {uuid} user
   * @returns {userCollection}
   */
  async getLoggedinUser(req) {
    try {
      let userCollection = await User.findOne({ id: req.user._id });
      userCollection = _.pick(userCollection, [
        "email",
        "name",
        "wallet.balance",
      ]);
      return userCollection;
    } catch (e) {
      throw new ErrorResponse(e.message, e.statusCode);
    }
  },

  /**
   *  @param {string} email
   * @returns {userCollection}
   */
  async verifyEmail(email) {
    try {
      let userCollection = await User.findOne({ email: email });
      if (!userCollection) {
        throw new ErrorResponse(`Email does not exist`, 404);
      }
      return userCollection;
    } catch (e) {
      throw new ErrorResponse(e.message, e.statusCode);
    }
  },

  /**
   * @param {object} user
   * @param {int} withdrawalAmount
   * @returns {createTransaction}
   */
  async withdrawFunds(user, withdrawalAmount) {
    const session = await mongoose.startSession();
    const walletCollection = user.wallet;
    session.startTransaction();
    try {
      if (+withdrawalAmount <= 0) {
        throw new ErrorResponse(`Amount must be greater than zero`, 400);
      }

      if (walletCollection.balance < +withdrawalAmount) {
        throw new ErrorResponse(`Your account balance is not sufficient`, 400);
      }

      const newBalance = walletCollection.balance - withdrawalAmount;
      updateWallet = await user.updateOne(
        { "wallet.balance": newBalance },
        { returnOriginal: false },
        { session }
      );

      const createTransaction = await walletTransaction.create(
        [
          {
            user: user._id,
            trnxType: "DR",
            purpose: "withdrawal",
            amount: withdrawalAmount,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return createTransaction;
    } catch (e) {
      throw new ErrorResponse(e.message, e.statusCode);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  },

  /**
   * @param {object} user
   * @param {uuid} recipient
   * @param {int} amount
   * @returns {createSenderTransaction, createReceiverTransaction}
   */
  async transferFunds(user, recipient, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const recipientWallet = await User.findById(recipient);

      if (!user) {
        throw new ErrorResponse(`User not found`, 404);
      }

      if (!recipientWallet) {
        throw new ErrorResponse(`Recipient not found`, 404);
      }

      const transferAmount = parseInt(amount);
      const sourceWalletCollection = user.wallet;
      const destinationWalletCollection = recipientWallet.wallet;

      if (!sourceWalletCollection) {
        throw new ErrorResponse(`Source wallet not found`, 404);
      }
      if (!destinationWalletCollection) {
        throw new ErrorResponse(`Destination wallet not found`, 404);
      }
      if (+transferAmount <= 0) {
        throw new ErrorResponse(`Amount must be greater than zero`, 400);
      }

      if (user._id == recipient) {
        throw new ErrorResponse(`You can not transfer to yourself`, 400);
      }

      if (sourceWalletCollection.balance.toString() < transferAmount) {
        throw new ErrorResponse(`Your account balance is not sufficient`, 400);
      }

      const sourceNewBalance =
        +sourceWalletCollection.balance.toString() - transferAmount;
      const destinationNewBalance =
        +destinationWalletCollection.balance.toString() + transferAmount;
      const updateSourceWallet = await user.updateOne(
        { "wallet.balance": sourceNewBalance },
        { session }
      );
      const updateDestinationWallet = await recipientWallet.updateOne(
        { "wallet.balance": destinationNewBalance },
        { session }
      );

      const createSenderTransaction = await walletTransaction.create(
        [
          {
            user: user._id,
            trnxType: "DR",
            destinationWallet: recipientWallet._id,
            sourceWallet: user._id,
            purpose: "transfer",
            amount: transferAmount,
          },
        ],
        { session }
      );

      const createReceiverTransaction = await walletTransaction.create(
        [
          {
            user: user._id,
            destinationWallet: recipientWallet._id,
            sourceWallet: user._id,
            trnxType: "CR",
            purpose: "deposit via transfer",
            amount: transferAmount,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return { createSenderTransaction, createReceiverTransaction };
    } catch (e) {
      throw new ErrorResponse(e, e.statusCode);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  },
};
