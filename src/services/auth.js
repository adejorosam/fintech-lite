//user.js
const User = require("../models/User");
// const wallet = require("../models/Wallet");
const mongoose = require("mongoose")
const _ = require('lodash')
const bcrypt = require("bcryptjs");
const securePassword = require('../utils/securePassword');
const getSignedToken = require('../utils/getSignedToken');
const ErrorResponse = require("../utils/error");

module.exports = {

    
    async login(req){
        try{
          let user = await User.findOne({email: req.body.email}).select('+password');
            
            if(!user){
                throw (new ErrorResponse("An account for this email does not exist", 404));
            }
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if(!validPass){
                throw(new ErrorResponse("E-mail or password is wrong", 400));
            }
            const token = await getSignedToken(user);

            user = _.pick(user, ['email', 'name'])
            return {user, token}
 
          }catch(e){
            throw (new ErrorResponse(e.message, e.statusCode));
          }
    },

    
 
  
  async register(req) {
                       

    try {

      const userExists = await User.findOne({ email: req.body.email});
      if(userExists != null){
            throw (new ErrorResponse("E-mail already exists",  400))
        }
    
        
        let userCollection = await User.create({
            email: req.body.email,
            name: req.body.name,
            password: await securePassword(req.body.password),
        })

        const token = await getSignedToken(userCollection);


        return token
    } catch (e) {

      throw (new ErrorResponse(e.message,  500))
    }
  },
}