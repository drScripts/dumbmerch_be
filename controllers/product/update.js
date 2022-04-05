const { request, response } = require("express");
const { Product, ProductCategory } = require("../../models");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const { Model, Op } = require("sequelize");

/**
 *
 * @param {request} req
 * @param {response} res
 * @returns
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      description: Joi.string(),
      stock: Joi.number().min(1),
      category_ids: Joi.array(),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: "Error body!",
        validation_error: validation.error.details,
      });

    const product = await Product.findByPk(id);

    if (!product)
      return res.status(404).json({
        status: "Not found",
        message: "Can't find product",
      });

    const { name, price, description, stock, category_ids } = req.body;
    const file = req.file;
    let data = {};

    if (file) {
      data.image_name = file.filename;
      data.image_url = file.filename;

      const imagePath = path.resolve(
        __dirname,
        "../../public/images/products/" + product.image_name
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    data = {
      ...data,
      name,
      price,
      description,
      stock,
    };

    await product.update(data);

    const categoryId = category_ids.map((category, index) => {
      return {
        productId: id,
        CategoryId: category,
      };
    });

    if (category_ids) {
      await ProductCategory.destroy({
        where: {
          [Op.or]: { productId: id },
        },
      });
      await ProductCategory.bulkCreate(categoryId);
    }

    const newProduct = await Product.findByPk(id, { include: "categories" });

    return res.status(201).json({
      status: "created",
      message: "Product updated!",
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
