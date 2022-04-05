const { request, response } = require("express");
const Joi = require("joi");
const { Product, ProductCategory } = require("../../models");
const { Model } = require("sequelize");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      stock: Joi.number().min(1).required(),
      category_ids: Joi.array().required(),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: "Error body!",
        validation_error: validation.error.details,
      });

    const { id: userId } = req.user;
    const { name, price, description, stock, category_ids } = req.body;
    const file = req.file;
    if (!file)
      return res.status(400).json({
        status: "error",
        message: "Please upload product image",
      });

    const fileName = file.filename;

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      userId,
      image_name: fileName,
      image_url: fileName,
    });

    const productCategoryObj = category_ids.map((id, index) => {
      return {
        productId: product.id,
        CategoryId: id,
      };
    });

    await ProductCategory.bulkCreate(productCategoryObj);

    const newProduct = await Product.findByPk(product.id, {
      include: ["categories"],
    });

    res.status(201).json({
      status: "created",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
