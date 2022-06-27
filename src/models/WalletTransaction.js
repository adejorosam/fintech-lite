const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema(
  {
    amount: {
      type: mongoose.Decimal128,
      get: getAmount,
      required: true,
    },

    trnxType: {
      type: String,
      required: true,
      enum: ["CR", "DR"],
    },

    purpose: {
      type: String,
      enum: ["transfer", "deposit", "withdrawal", "deposit via transfer"],
      required: true,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    sourceWallet: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    destinationWallet: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { toJSON: { getters: true } },
  { timestamps: true }
);
function getAmount(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

module.exports = mongoose.model(
  "WalletTransaction",
  WalletTransactionSchema,
  "walletTransaction"
);
