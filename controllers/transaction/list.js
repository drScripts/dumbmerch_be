const { request, response } = require("express");
const { Transaction, TransactionItem, Product, User } = require("../../models");
const { getFileImageUrlArray } = require("../../helpers");

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

    const newTransactions = transactions.map((transaction, index) => {
      transaction.transactionItems = getFileImageUrlArray(
        transaction.transactionItems,
        "products",
        "itemProduct"
      );

      return transaction;
    });

    res.status(200).json({
      status: "success",
      data: { transactions: newTransactions },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
