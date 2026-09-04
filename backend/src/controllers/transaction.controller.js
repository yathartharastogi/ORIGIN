import {
  getTransactionDetails,
} from "../services/transaction.service.js";


const getTransaction = async (req, res) => {
  const { transactionId } = req.params;

  const transaction =
    await getTransactionDetails(
      transactionId
    );

  res.status(200).json({
    success: true,
    data: transaction,
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};


export {
  getTransaction,
};