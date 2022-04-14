const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { authMiddleware } = require("./middleware");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/carts");
const categoryRouter = require("./routes/categories");
const shipmentRouter = require("./routes/shipment");
const transactionRouter = require("./routes/transaction");
const { webHook, callback } = require("./controllers/transaction");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const prefix = "/api/v1";
app.post(`${prefix}/notification`, webHook);
app.post(`${prefix}/callback`, callback);
app.use(prefix, authRouter);
app.use(prefix, authMiddleware, productRouter);
app.use(prefix, authMiddleware, cartRouter);
app.use(prefix, authMiddleware, categoryRouter);
app.use(prefix, authMiddleware, shipmentRouter);
app.use(prefix, authMiddleware, transactionRouter);
app.use(prefix, authMiddleware, usersRouter);

module.exports = app;
