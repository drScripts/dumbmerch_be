const { request, response } = require("express");
const { Product } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const products = await Product.findAll({
      include: "categories",
      where: {
        userId,
      },
    });

    res.send({
      status: "success",
      data: {
        products,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
