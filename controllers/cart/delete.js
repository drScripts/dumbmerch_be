const { request, response } = require("express");
const { Cart } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findByPk(id);

    if (!cart)
      return res.status(404).json({
        status: "Not found!",
        message: "Can't find cart items!",
      });

    await cart.destroy();

    res.status(201).json({
      status: "created",
      message: "Success delete cart item",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
