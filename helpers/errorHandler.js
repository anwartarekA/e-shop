const AppError = require("./appError");

// handle error at development
const sendDevError = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};
// handle unauthorized token
const handleUnauthorizedError = (error) => {
  return new AppError(error.message, 401);
};
//hanlde revoked token
const handleRevokedToken = (error) => {
  return new AppError(error.message, 401);
};
//handle expired jwt
const handleExpiredJwt = (error) => {
  return new AppError(error.message, 401);
};
// handle error at production
const sendProError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
const errorHandler = (error, req, res, next) => {
  let err;
  error.statusCode = error?.statusCode || 500;
  error.status = error.status || "error";
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    sendDevError(error, res);
  }
  if (process.env.NODE_ENV === "production") {
    if (error.message === "No authorization token was found")
      err = handleUnauthorizedError(error);
    if (error.message === "The token has been revoked.")
      err = handleRevokedToken(error);
    if (error.message === "jwt expired") err = handleExpiredJwt(error);
    sendProError(err, res);
  }
};
module.exports = errorHandler;
