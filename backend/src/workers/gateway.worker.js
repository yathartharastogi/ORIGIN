import {
  findManyByTransactionId,
} from "../repositories/gateway.repository.js";

const collectGatewayEvidence = async (transactionId) => {
  const records = await findManyByTransactionId(
    transactionId
  );

  return {
    source: "GATEWAY",
    transactionId,
    found: records.length > 0,
    recordCount: records.length,
    records,
  };
};

export {
  collectGatewayEvidence,
};