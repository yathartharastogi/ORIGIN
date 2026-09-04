import {
  findByTransactionId,
} from "../repositories/transaction.repository.js";

import {
  findManyByTransactionId as findGatewayRecords,
} from "../repositories/gateway.repository.js";

import {
  findManyByTransactionId as findBankRecords,
} from "../repositories/bank.repository.js";

import {
  findManyByTransactionId as findLedgerRecords,
} from "../repositories/ledger.repository.js";


const getTransactionDetails = async (
  transactionId
) => {
  const transaction =
    await findByTransactionId(
      transactionId
    );

  if (!transaction) {
    const error = new Error(
      "Transaction was not found."
    );

    error.code =
      "TRANSACTION_NOT_FOUND";

    error.statusCode = 404;

    throw error;
  }

  const [
    gateway,
    bank,
    ledger,
  ] = await Promise.all([
    findGatewayRecords(transactionId),
    findBankRecords(transactionId),
    findLedgerRecords(transactionId),
  ]);

  return {
    transaction,

    sources: {
      gateway: {
        exists: gateway.length > 0,
        recordCount: gateway.length,
        records: gateway,
      },

      bank: {
        exists: bank.length > 0,
        recordCount: bank.length,
        records: bank,
      },

      ledger: {
        exists: ledger.length > 0,
        recordCount: ledger.length,
        records: ledger,
      },
    },
  };
};


export {
  getTransactionDetails,
};