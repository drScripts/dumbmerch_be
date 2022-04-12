const { request, response } = require('express')
const { validateSignatureMidtransKey } = require('../../helpers')
const { Transaction, TransactionLogs } = require('../../models')

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const {
      transaction_status,
      status_code,
      signature_key,
      payment_type,
      order_id,
      gross_amount,
      fraud_status,
    } = req.body

    const serverSignature = validateSignatureMidtransKey(
      order_id,
      status_code,
      gross_amount,
    )

    if (serverSignature !== signature_key)
      res.status(500).json({
        status: 'error',
        message: 'Unauthorized',
      })

    const orderId = order_id.split('-')[0]

    const transaction = await Transaction.findByPk(orderId)

    if (!transaction)
      return res.status(500).json({
        status: 'error',
        message: 'Cant find transaction',
      })

    let transactionStatus = 'pending'

    if (transaction_status == 'capture') {
      if (fraud_status == 'challenge') {
        transactionStatus = 'pending'
      } else if (fraud_status == 'accept') {
        transactionStatus = 'success'
      }
    } else if (transaction_status == 'settlement') {
      transactionStatus = 'success'
    } else if (
      transaction_status == 'cancel' ||
      transaction_status == 'deny' ||
      transaction_status == 'expire'
    ) {
      transactionStatus = 'failed'
    } else if (transaction_status == 'pending') {
      transactionStatus = 'pending'
    }

    await transaction.update({
      status: transactionStatus,
      payment_type,
    })

    await TransactionLogs.create({
      transactionId: orderId,
      raw_response: JSON.stringify(req.body),
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Accepted',
    })
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}
