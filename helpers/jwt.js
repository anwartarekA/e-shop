const { expressjwt: jwt } = require("express-jwt");
const checkJwt = () => {
  const api = `/api/v1/`;
  return jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    getToken: (req) => {
      if (req.cookies && req.cookies.cookie_token) {
        return req.cookies.cookie_token;
      }
    },
    isRevoked: revoke,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}users/register`,
      `${api}users/login`,
    ],
  });
};
function revoke(req, token) {
  if (!token.payload.isAdmin) return true;
  return false;
}
module.exports = checkJwt;
