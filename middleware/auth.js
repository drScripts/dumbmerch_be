const { request, response } = require("express");
const { verify } = require("jsonwebtoken");
const { jwtSecret } = require("../config");

/**
 *
 * @param {request} req
 * @param {response} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization || authorization?.search("Bearer ") === -1)
    return res.status(401).json({
      status: "Un-Authorized",
      message: "Invalid user token",
    });
  const token = authorization.split("Bearer ").pop();

  try {
    const verifying = verify(token, jwtSecret);
    req.user = verifying;
  } catch (err) {
    return res.status(401).json({
      status: "Un-Authorized",
      message: "Invalid user token",
    });
  }

  next();
};
