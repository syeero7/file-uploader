import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

import { getUser } from "../prisma/queries.js";

const strategy = new LocalStrategy(
  { usernameField: "email", passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      req.session.messages = [];

      const user = await getUser({ email });
      if (!user) return done(null, false, { message: "Incorrect e-mail" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export const initializePassport = (passport) => {
  passport.use(strategy);
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUser({ id });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
