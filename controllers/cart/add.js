const { request, response } = require("express");
const { Cart, User, Product } = require("../../models");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const scheme = Joi.object({
      product_id: Joi.number().required(),
      quantity: Joi.number().min(1).required(),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: "Error body!",
        validation_error: validation.error.details,
      });

    const { product_id: productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product)
      return res.status(404).json({
        status: "Not found",
        message: "Can't find product",
      });

    const cart = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (cart) {
      await cart.update({
        qty: cart.qty + quantity,
      });
    } else {
      await Cart.create({
        userId,
        quantity,
        productId,
      });
    }

    res.status(201).json({
      status: "created",
      message: "Success add product to cart",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
