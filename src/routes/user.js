// const { userController } = require("../controllers/user");
const validationMiddleware  = require("../middlewares");
const authMiddleware  = require("../middlewares/authMiddleware");
const { withdrawFunds, transferFunds, getAllUsers, getLoggedinUser } = require("../controllers/user");

const {
  transferFundValidationRules,
  withdrawFundValidationRules,
} = require("../middlewares/userValidationMiddleware");

const router = require("express").Router();

router.get("/all-users", authMiddleware, getAllUsers);

router.get(
  "/me",
  authMiddleware,
 getLoggedinUser
);


router.post(
  "/transfer-fund",
  authMiddleware,
  transferFundValidationRules(),
  validationMiddleware,
  transferFunds
);

router.post(
  "/withdraw-fund",
  authMiddleware,
  withdrawFundValidationRules(),
  validationMiddleware,
  withdrawFunds
);





// router.post(
//   "/paystack-pay",
//   authMiddleware,
//   // transferFundValidationRules(),
//   // validationMiddleware,
//   depositFundPage
// );


module.exports = router;
