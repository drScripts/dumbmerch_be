const { request, response } = require("express");
const Joi = require("joi");
const { Product, ProductCategory } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      name: Joi.string().required().message({
        'string.base':"Product name should be a type of string",
        'any.required':"Please insert the product name"
      }),
      price: Joi.number().required().messages({
        'number.base':"Price must be a type of number",
        'any.required':"Please insert product price"
      }),
      description: Joi.string().required().messages({
        'string.base':"Product description must be a type of string",
        "any.required":"Please insert product description"
      }),
      stock: Joi.number().min(1).required().messages({
        'number.base':"Product stock must be a type of number",
        'number.min':"Minimal stock was 1",
        'any.required':"Please insert product stock"
      }),
      category_ids: Joi.array().required().messages({
        'array.base':"Category product must be a type of array",
        'any.required':"Please insert the product category minimal 1 items"
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message, 
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
