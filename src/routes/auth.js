const { register, login } = require("../controllers/auth");
const validatorMiddleware = require("../middlewares");
const {
  loginValidatorRules,
  registerValidatorRules,
} = require("../middlewares/authValidator");

const router = require("express").Router();

router.post(
  "/register",
  registerValidatorRules(),
  validatorMiddleware,
  register
);

router.post("/login", loginValidatorRules(), validatorMiddleware, login);

module.exports = router;
