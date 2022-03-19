const { depositFunds,errorPage, successPage, homepage, paystackCallback} = require("../controllers/paystack");


const router = require("express").Router();

router.post(
  "/paystack/pay",
  depositFunds
);

router.get('/home', homepage)

router.get('/error', errorPage)

router.get('/success', successPage)

router.get('/paystack/callback', paystackCallback)



module.exports = router;
