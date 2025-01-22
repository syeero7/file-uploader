import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import { validateUser } from "../utils/validation.js";
import { createUser } from "../prisma/queries.js";

export const signupUserGet = (req, res) => res.render("sign-up");

export const signupUserPost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) res.render("sign-up", { errors: errors.array() });

    const { email, password } = req.body;

    bcrypt.hash(password, 10, async (error, hashedPassword) => {
      if (error) return next(error);

      await createUser(email, hashedPassword);
      res.redirect("/user/sign-in");
    });
  },
];

export const signinUserGet = (req, res) => {
  const errors = req.session.messages?.map((msg) => ({ msg })) || [];
  res.render("sign-in", { errors });
};

export const logoutUserPost = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
