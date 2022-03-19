const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    // _id: { type: Schema.Types.ObjectId },
    name:{
        type: String,
        required: 'Enter a name',
        min: 3,
        max: 50,

    },
    
    email:{
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true    
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
        select: false,
      },

      wallet: {
        balance: {
          type: mongoose.Decimal128,
          default:0.00
        },
    }
        
},    
{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema, 'user');