const User = require("../models/User");
const walletTransaction = require("../models/WalletTransaction");
const _ = require("lodash");
const request = require("request");
const mongoose = require("mongoose");
const { initializePayment, verifyPayment } =
  require("../config/paystack")(request);

module.exports = {
  async homepage(req, res, next) {
    try {
      res.render("index");
    } catch (e) {
      return next(new ErrorResponse(e.message, 500));
    }
  },

  async errorPage(req, res, next) {
    try {
      res.render("error");
    } catch (e) {
      return next(new ErrorResponse(e.message, 500));
    }
  },

  async successPage(req, res, next) {
    try {
      res.render("success");
    } catch (e) {
      return next(new ErrorResponse(e.message, 500));
    }
  },

  async depositFunds(req, res, next) {
    try {
      // console.log(req)
      const form = _.pick(req.body, ["amount", "email", "full_name"]);
      console.log(form);
      form.metadata = {
        full_name: form.full_name,
        // user_id:req.user._id
      };
      form.amount *= 100;

      initializePayment(form, (error, body) => {
        if (error) {
          //handle errors
          console.log(error);
          return res.redirect("/error");
        }
        response = JSON.parse(body);
        console.log(response);
        res.redirect(response.data.authorization_url);
      });
    } catch (e) {
      return res.redirect("/error");
    }
  },

  async paystackCallback(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const ref = req.query.reference;
      verifyPayment(ref, (err, body) => {
        if (err) {
          console.log(err);
          return res.redirect("/error");
        } else {
          response = JSON.parse(body);

          const data = _.at(response.data, [
            "reference",
            "amount",
            "customer.email",
          ]);
          [reference, amount, email] = data;
          console.log(email);
          User.findOne({ email: email }).then((result) => {
            console.log(result);
            if (!result) {
              return res.redirect("/error");
            }
            result.updateOne(
              { "wallet.balance": amount },
              { returnOriginal: false },
              { session }
            );
            walletTransaction.create(
              [
                {
                  user: result._id,
                  trnxType: "CR",
                  purpose: "deposit",
                  amount: amount,
                },
              ],
              { session }
            );
            return res.redirect("/success");
          });
        }
        session.commitTransaction();
      });
    } catch (error) {
      session.abortTransaction();
      return res.redirect("/error");
    } finally {
    }
  },
};
