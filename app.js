import express from "express";
import session from "express-session";
import passport from "passport";

import sessionStore from "./config/sessionStore.js";
import { initializePassport } from "./config/passport.js";
import indexRouter from "./routes/indexRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    store: sessionStore,
  })
);

initializePassport(passport);
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
