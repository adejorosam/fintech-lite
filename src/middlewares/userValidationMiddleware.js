const { body } = require("express-validator");

const fundAccountValidationRules = () => {
  return [body("amount").notEmpty().withMessage("Amount is required")];
};

const transferFundValidationRules = () => {
  return [
    body("transferAmount").notEmpty().isNumeric().withMessage("Amount is required"),
    body("recipient").notEmpty().withMessage("A valid recipient is required"),
  ];
};

const withdrawFundValidationRules = () => {
  return [
    body("withdrawalAmount").notEmpty().isNumeric().withMessage("Amount is required"),
  ];
};

module.exports = {
  fundAccountValidationRules,
  transferFundValidationRules,
  withdrawFundValidationRules,
};
