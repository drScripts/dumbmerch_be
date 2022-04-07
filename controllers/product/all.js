const { request, response } = require("express");
const { Product } = require("../../models");
const { getFileImageUrlArray } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const rawProducts = await Product.findAll({
      include: "categories",
      where: {
        userId,
      },
    });

    const products = getFileImageUrlArray(rawProducts);

    res.status(200).json({
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
