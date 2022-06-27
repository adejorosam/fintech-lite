const validationMiddleware = require("../middlewares");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  withdrawFunds,
  transferFunds,
  getAllUsers,
  getLoggedinUser,
  getUserTransactions,
  verifyEmail,
} = require("../controllers/user");

const {
  transferFundValidationRules,
  withdrawFundValidationRules,
} = require("../middlewares/userValidationMiddleware");

const router = require("express").Router();

router.get("/all-users", getAllUsers);

router.get("/me", authMiddleware, getLoggedinUser);

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

router.get("/transactions", authMiddleware, getUserTransactions);

router.post("/verify", verifyEmail);

module.exports = router;
