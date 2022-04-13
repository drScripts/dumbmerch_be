const { request, response } = require("express");
const {
  validateSignatureMidtransKey,
  emailInvoiceHtml,
  sendMail,
} = require("../../helpers");
const { Transaction, TransactionLogs, User } = require("../../models");
const {
  snapServerKey,
  snapIsProduction,
  snapClientKey,
} = require("../../config");
const { Snap } = require("midtrans-client");

const apiClient = new Snap({
  isProduction: snapIsProduction,
  serverKey: snapServerKey,
  clientKey: snapClientKey,
});

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const statusResponse = await apiClient.transaction.notification(req.body);

    const {
      transaction_status,
      status_code,
      signature_key,
      payment_type,
      order_id,
      gross_amount,
      fraud_status,
    } = statusResponse;

    const serverSignature = validateSignatureMidtransKey(
      order_id,
      status_code,
      gross_amount
    );

    if (serverSignature !== signature_key)
      res.status(500).json({
        status: "error",
        message: "Unauthorized",
      });

    const orderId = order_id.split("-")[0];

    const transaction = await Transaction.findByPk(orderId, {
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
        include: "profile",
      },
    });

    if (!transaction)
      return res.status(500).json({
        status: "error",
        message: "Cant find transaction",
      });

    const invoiceEmail = emailInvoiceHtml(
      transaction?.createdAt,
      transaction?.total,
      transaction?.user?.name,
      transaction?.updatedAt,
      order_id,
      transaction?.raw_body
    );

    let transactionStatus = "pending";

    if (transaction_status == "capture") {
      if (fraud_status == "challenge") {
        transactionStatus = "pending";
      } else if (fraud_status == "accept") {
        transactionStatus = "success";

        await sendMail(transaction?.user?.email, invoiceEmail);
      }
    } else if (transaction_status == "settlement") {
      transactionStatus = "success";
      await sendMail(transaction?.user?.email, invoiceEmail);
    } else if (
      transaction_status == "cancel" ||
      transaction_status == "deny" ||
      transaction_status == "expire"
    ) {
      transactionStatus = "failed";
    } else if (transaction_status == "pending") {
      transactionStatus = "pending";
    }

    await transaction.update({
      status: transactionStatus,
      payment_type,
    });

    await TransactionLogs.create({
      transactionId: orderId,
      raw_response: req.body,
    });

    return res.status(200).json({
      status: "Success",
      message: "Accepted",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
