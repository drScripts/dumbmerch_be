const { response, request } = require("express");
const { midtransCallbackUrl } = require("../../config");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = (req, res) => {
  try {
    const { response } = req.body;

    const { order_id } = JSON.parse(response);

    const transactionId = order_id?.split("-")[0];

    res.redirect(midtransCallbackUrl + `/${transactionId}`);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
