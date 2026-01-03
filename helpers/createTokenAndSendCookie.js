const jwt = require("jsonwebtoken");
const createTokenAndSendCookie = (user, res) => {
  const token = jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.EXPIRESIN,
    },
  );
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
  if (process.env.NODE_ENV === "production") options.secure = true;
  return res.cookie("cookie_token", token, options);
};
module.exports = createTokenAndSendCookie;
