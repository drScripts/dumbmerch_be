const { request, response } = require("express");
const { getFileImageUrl } = require("../../helpers");
const { Cart, User } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const carts = await Cart.findAll({
      include: [
        "product",
        {
          as: "user",
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
      where: {
        userId,
      },
    });

    carts.map((cart, index) => {
      cart.product.image_url = getFileImageUrl(cart.product.image_url);
      return cart;
    });

    res.status(200).json({
      status: "success",
      data: { carts },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
