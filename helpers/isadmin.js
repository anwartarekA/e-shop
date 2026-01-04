const jwt = require("jsonwebtoken");
const AppError = require("./../helpers/appError");
const isAdmin = (req, res, next) => {
  const token = req.cookies.cookie_token;
  const decoded = jwt.decode(token);
  if (!decoded.isAdmin)
    return next(new AppError("not allowed to access this route", 403));
  return next();
};
module.exports = isAdmin;
