const normalizeEvidence = (evidence) => {
  const gatewayRecords =
    evidence.sources.gateway.records || [];

  const bankRecords =
    evidence.sources.bank.records || [];

  const ledgerRecords =
    evidence.sources.ledger.records || [];

  return {
    transactionId: evidence.transactionId,

    gateway: {
  exists: gatewayRecords.length > 0,
  recordCount: gatewayRecords.length,
  record: gatewayRecords[0] || null,
  records: gatewayRecords,
},

    bank: {
  exists: bankRecords.length > 0,
  recordCount: bankRecords.length,
  record: bankRecords[0] || null,
  records: bankRecords,
},

    ledger: {
  exists: ledgerRecords.length > 0,
  recordCount: ledgerRecords.length,
  record: ledgerRecords[0] || null,
  records: ledgerRecords,
},

    collectedAt: evidence.collectedAt,
  };
};

export {
  normalizeEvidence,
};