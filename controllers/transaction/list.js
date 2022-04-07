const { request, response } = require("express");
const { Transaction, TransactionItem, Product, User } = require("../../models");

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

    res.status(200).json({
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
