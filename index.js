const bodyParser = require("body-parser");
const exress = require("express");
const cookieParser = require("cookie-parser");
const app = exress();
require("dotenv/config");
const morgan = require("morgan");
const mongoose = require("mongoose");
const checkJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/errorHandler");
//routers
const productRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const categoryRouter = require("./routers/category");
const userRouter = require("./routers/user");
const OrderItemRouter = require("./routers/orderItem");

// middlewares
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(checkJwt());
const api = process.env.API_VERSION;
app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orderItems`, OrderItemRouter);

app.use(errorHandler);
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("connected to db successfully"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
