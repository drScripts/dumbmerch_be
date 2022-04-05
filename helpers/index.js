const { sign } = require("jsonwebtoken");
const { jwtSecret } = require("../config");

const getJwtToken = (payload) => {
  const token = sign(payload, jwtSecret);
  return token;
};

module.exports = { getJwtToken };
