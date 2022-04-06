const { request, response } = require("express");
const { Cart } = require("../../models");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = Joi.object({
      quantity: Joi.number().min(1).messages({
        "number.base": "Quantity must be a type of number",
        "number.min": "Quantity value must be greater or equal to 1",
      }),
      event: Joi.string()
        .valid("increment", "decrement", "update")
        .required()
        .messages({
          "string.base": "Event must be a type of string",
          "any.only":
            "Event value must be either increment,decrement,or update",
          "any.required": "Please insert event value",
        }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const cart = await Cart.findByPk(id);

    if (!cart)
      return res.status(404).json({
        status: "Not found",
        message: "Can't find product",
      });

    const { quantity, event } = req.body;

    let newQty = cart.qty;

    if (event === "increment") {
      newQty += quantity;
    } else if (event === "decrement") {
      if (newQty > 1 && newQty - quantity !== 0) {
        newQty -= quantity;
      }
    } else {
      newQty = quantity;
    }

    await cart.update({
      qty: newQty,
    });

    res.status(201).json({
      status: "created",
      message: "Success update product to cart",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
