const { request, response } = require("express");
const { Transaction, TransactionItem, Product, User } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id, {
      include: [
        "transactionShipmentLogs",
        "transactionLogs",
        {
          model: TransactionItem,
          as: "transactionItems",
          include: {
            model: Product,
            as: "itemProduct",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: {
              model: User,
              as: "user",
              attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
              },
            },
          },
        },
      ],
    });

    res.send({
      status: "success",
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Interal server error",
    });
  }
};
