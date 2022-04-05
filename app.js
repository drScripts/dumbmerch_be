const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { authMiddleware } = require("./middleware");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const productRouter = require("./routes/product");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const prefix = "/api/v1";
app.use(prefix, authRouter);
app.use(authMiddleware);
app.use(prefix, productRouter);
app.use("/users", usersRouter);

module.exports = app;
