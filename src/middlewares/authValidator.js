const { body } = require("express-validator");

const registerValidatorRules = () => {
  return [
    body("name").notEmpty().withMessage("The name field is required"),
    body("email").isEmail().withMessage("The email field is required"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password min length is 5"),
  ];
};

const loginValidatorRules = () => {
  return [
    body("email").isEmail().notEmpty().withMessage("The email is required"),
    body("password").notEmpty().withMessage("The password field is required"),
  ];
};

module.exports = {
  registerValidatorRules,
  loginValidatorRules,
};
