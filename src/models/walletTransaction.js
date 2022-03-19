const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema({
  amount: {
    type: mongoose.Decimal128,
    required: true
  },

  trnxType: {
    type: String,
    required: true,
    enum: ['CR', 'DR']
  },
  
  purpose:{
    type: String,
    enum : ['transfer', 'deposit', 'withdrawal', 'deposit via transfer'],
    required: true
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  sourceWallet: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  destinationWallet: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  
},     { timestamps: true }
);


module.exports = mongoose.model('WalletTransaction', WalletTransactionSchema, 'walletTransaction');