import express from "express";
import session from "express-session";
import passport from "passport";

import sessionStore from "./config/sessionStore.js";
import { initializePassport } from "./config/passport.js";
import indexRouter from "./routes/indexRouter.js";
import userRouter from "./routes/userRouter.js";
import fileRouter from "./routes/fileRouter.js";
import e from "express";

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
app.use("/file", fileRouter);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send(error.message);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
