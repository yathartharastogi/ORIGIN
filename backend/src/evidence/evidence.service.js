import {
  collectGatewayEvidence,
} from "../workers/gateway.worker.js";

import {
  collectBankEvidence,
} from "../workers/bank.worker.js";

import {
  collectLedgerEvidence,
} from "../workers/ledger.worker.js";

const collectEvidence = async (transactionId) => {
  const [
    gateway,
    bank,
    ledger,
  ] = await Promise.all([
    collectGatewayEvidence(transactionId),
    collectBankEvidence(transactionId),
    collectLedgerEvidence(transactionId),
  ]);

  return {
    transactionId,
    sources: {
      gateway,
      bank,
      ledger,
    },
    collectedAt: new Date(),
  };
};

export {
  collectEvidence,
};