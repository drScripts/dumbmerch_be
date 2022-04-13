const { request, response } = require("express");
const {
  Transaction,
  Cart,
  TransactionItem,
  ShipmentLogs,
  Product,
} = require("../../models");
const { getSnapUrl, getSnapUrlPack } = require("../../helpers");

const Joi = require("joi");

const getTotalCost = (carts) => {
  let total = 0;

  carts.forEach((val, index) => (total += val.qty * val.product.price));

  return total;
};

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      shipment_service: Joi.string()
        .valid("jne", "tiki", "pos")
        .required()
        .messages({
          "string.base": "shipment service must be a type of string",
          "any.only": "shipment service value must either jne,post,or tiki",
          "any.required": "Please insert shipment servce",
        }),
      shipment_cost: Joi.number().required().messages({
        "number.base": "shipment cost must be a type of number",
        "any.required": "Please insert shipment cost",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { shipment_service, shipment_cost } = req.body;
    const { id: userId } = req.user;

    const carts = await Cart.findAll({
      where: {
        userId,
      },
      include: ["product"],
    });

    if (!carts.length)
      return res.status(400).json({
        status: "error",
        message: "Your cart was empty",
      });

    const total = getTotalCost(carts) + shipment_cost;

    const transaction = await Transaction.create({
      userId,
      total,
    });

    const transactionItems = carts.map((cart, index) => {
      return {
        productId: cart.product.id,
        transactionId: transaction.id,
        qty: cart.qty,
      };
    });

    await TransactionItem.bulkCreate(transactionItems);

    await ShipmentLogs.create({
      transactionId: transaction.id,
      description: `Your transaction use ${shipment_service.toUpperCase()}`,
      shipment: shipment_service,
      cost: shipment_cost,
      status: "SHIPMENT CREATED",
    });

    const { bodyData, url, status } = await getSnapUrlPack(
      carts,
      req.user,
      transaction,
      total,
      shipment_service,
      shipment_cost
    );

    if (status !== 201) {
      await transaction.destroy();

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    await transaction.update({
      payment_url: url,
      raw_body: bodyData,
    });

    const cartsIds = carts.map((cart, index) => cart.id);

    carts.forEach(async (cart, index) => {
      const product = await Product.findByPk(cart.product.id);
      await product.update({
        stock: (product.stock -= cart.qty),
      });
    });

    await Cart.destroy({
      where: {
        id: cartsIds,
      },
    });

    res.status(201).json({
      status: "created",
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err.response.data);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
