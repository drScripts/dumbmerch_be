const { request, response } = require("express");
const { Transaction, TransactionItem, Product, User } = require("../../models");
const { getFileImageUrl, getFileImageUrlArray } = require("../../helpers");

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
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
          include: "profile",
        },
      ],
    });

    if (!transaction)
      return res.status(400).json({
        status: "error",
        message: "Can't find transaction",
      });

    transaction.transactionItems = getFileImageUrlArray(
      transaction.transactionItems,
      "products",
      "itemProduct"
    );

    transaction.user.profile.profile_picture = getFileImageUrl(
      transaction?.user?.profile?.profile_picture,
      "users"
    );

    res.status(200).json({
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
