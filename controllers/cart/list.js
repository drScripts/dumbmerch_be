const { request, response } = require("express");
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

    res.send({
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
