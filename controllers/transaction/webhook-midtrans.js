const { request, response } = require("express");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = (req, res) => {
  try {
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
