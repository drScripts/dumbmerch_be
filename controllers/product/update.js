const { request, response } = require("express");
const { Product, ProductCategory, Category } = require("../../models");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const { getFileImageUrl } = require("../../helpers");

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
      name: Joi.string().messages({
        "string.base": "Product name should be a type of string",
      }),
      price: Joi.number().messages({
        "number.base": "Price must be a type of number",
      }),
      description: Joi.string().messages({
        "string.base": "Product description must be a type of string",
      }),
      stock: Joi.number().min(1).messages({
        "number.base": "Product stock must be a type of number",
        "number.min": "Minimal stock was 1",
      }),
      category_ids: Joi.array().messages({
        "array.base": "Category product must be a type of array",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
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

    const categoryId = category_ids?.map((category, index) => {
      return {
        productId: id,
        categoryId: category,
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

    const newProduct = await Product.findByPk(id, {
      include: {
        model: Category,
        as: "categories",
        through: {
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    newProduct.image_url = getFileImageUrl(newProduct.image_url);

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
