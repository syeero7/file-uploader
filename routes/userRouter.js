import { Router } from "express";
import passport from "passport";

import {
  signupUserGet,
  signupUserPost,
  logoutUserPost,
  signinUserGet,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/sign-up", signupUserGet);
userRouter.get("/sign-in", signinUserGet);

userRouter.post("/sign-up", signupUserPost);
userRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/sign-in",
    failureMessage: true,
  })
);
userRouter.post("/logout", logoutUserPost);

export default userRouter;
