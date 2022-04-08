const { request, response } = require("express");
const { Product } = require("../../models");
const path = require("path");
const fs = require("fs");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product)
      return res.status(404).json({
        status: "Not Found!",
        message: "Can't find product!",
      });

    const imagePath = path.resolve(
      __dirname,
      `../../public/images/products/${product.image_name}`
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await product.destroy();

    res.status(201).json({
      status: "created",
      message: "Product successfully deleted!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
