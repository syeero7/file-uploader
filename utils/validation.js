import { body } from "express-validator";
import { getUser, getFolder } from "../prisma/queries.js";

const alphanumericErr = "must only contain letters and numbers";
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

export const validateFoldername = [
  body("foldername")
    .trim()
    .custom(async (value, { req }) => {
      const { id } = req.user;
      const folder = await getFolder(id, { name: value });
      if (folder) throw new Error("Folder already exists");
    })
    .isAlphanumeric("en-US", { ignore: /\s/ })
    .withMessage(`Folder name ${alphanumericErr}`)
    .isLength({ min: 1, max: 15 })
    .withMessage(`Folder name ${lengthErr(15)}`),
];
