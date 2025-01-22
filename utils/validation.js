import { body } from "express-validator";
import { getUser } from "../prisma/queries.js";

const emailErr = "Email must be formatted properly";
const passwordErr = "Passwords do not match";
const lengthErr = (max, min = 1) => {
  return `must be between ${min} and ${max} characters`;
};

export const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage(emailErr)
    .custom(async (value) => {
      const user = await getUser({ email: value });
      if (user) throw new Error("E-mail already in use");
    }),
  body("password")
    .trim()
    .isLength({ min: 6, max: 25 })
    .withMessage(`Password ${lengthErr(25, 6)}`),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(passwordErr),
];
