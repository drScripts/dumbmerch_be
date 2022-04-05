const { request, response } = require("express");
const { Transaction, TransactionItem } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.user;

    const transactions = await Transaction.findAll({
      where: {
        userId: id,
      },
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
      data: { transactions },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
