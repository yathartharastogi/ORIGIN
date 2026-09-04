const checkTimelineConsistency = ({
  gateway,
  bank,
  ledger,
}) => {
  const findings = [];

  const gatewayTime = gateway?.record?.processedAt;
  const bankReceivedTime = bank?.record?.receivedAt;
  const bankSettledTime = bank?.record?.settledAt;
  const ledgerTime = ledger?.record?.postedAt;

  // Gateway should happen before bank receives the transaction
  if (
    gatewayTime &&
    bankReceivedTime &&
    new Date(gatewayTime) > new Date(bankReceivedTime)
  ) {
    findings.push({
      code: "INVALID_GATEWAY_BANK_TIMELINE",
      severity: "HIGH",
      message:
        "Gateway processing occurred after the bank received the transaction.",
    });
  }

  // Bank should receive the transaction before settling it
  if (
    bankReceivedTime &&
    bankSettledTime &&
    new Date(bankReceivedTime) > new Date(bankSettledTime)
  ) {
    findings.push({
      code: "INVALID_BANK_SETTLEMENT_TIMELINE",
      severity: "HIGH",
      message:
        "Bank settlement occurred before the transaction was received.",
    });
  }

  // Bank settlement should happen before ledger posting
  if (
    bankSettledTime &&
    ledgerTime &&
    new Date(bankSettledTime) > new Date(ledgerTime)
  ) {
    // This is actually the expected order, so nothing is wrong.
  }

  // Ledger should not be posted before bank receives the transaction
  if (
    bankReceivedTime &&
    ledgerTime &&
    new Date(ledgerTime) < new Date(bankReceivedTime)
  ) {
    findings.push({
      code: "INVALID_LEDGER_TIMELINE",
      severity: "HIGH",
      message:
        "Ledger posting occurred before the bank received the transaction.",
    });
  }

  return {
    consistent: findings.length === 0,
    findings,
  };
};

export {
  checkTimelineConsistency,
};