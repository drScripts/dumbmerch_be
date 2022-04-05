const { request, response } = require("express");
const { Transaction, TransactionItem } = require("../../models");

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
          include: "itemProduct",
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
