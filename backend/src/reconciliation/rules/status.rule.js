const checkStatusConsistency = ({
  transaction,
  gateway,
  bank,
  ledger,
}) => {
  const findings = [];

  const gatewayStatus = gateway?.record?.status;
  const bankStatus = bank?.record?.status;
  const ledgerStatus = ledger?.record?.status;
  const transactionStatus = transaction?.transactionStatus;

  /*
   * Gateway-specific findings
   */

  if (gatewayStatus === "FAILED") {
    findings.push({
      code: "GATEWAY_FAILED",
      severity: "HIGH",
      message: "The payment gateway reported the transaction as failed.",
    });
  }

  if (gatewayStatus === "CANCELLED") {
    findings.push({
      code: "GATEWAY_CANCELLED",
      severity: "HIGH",
      message: "The payment gateway reported the transaction as cancelled.",
    });
  }

  /*
   * Bank-specific findings
   */

  if (bankStatus === "PENDING") {
    findings.push({
      code: "BANK_PENDING",
      severity: "MEDIUM",
      message: "The bank settlement is still pending.",
    });
  }

  if (bankStatus === "REJECTED") {
    findings.push({
      code: "BANK_REJECTED",
      severity: "HIGH",
      message: "The bank rejected the settlement.",
    });
  }

  if (bankStatus === "FAILED") {
    findings.push({
      code: "BANK_FAILED",
      severity: "HIGH",
      message: "The bank reported the settlement as failed.",
    });
  }

  /*
   * Ledger-specific findings
   */

  if (ledgerStatus === "REVERSED") {
    findings.push({
      code: "LEDGER_REVERSED",
      severity: "HIGH",
      message: "The ledger entry was reversed.",
    });
  }

  if (ledgerStatus === "PENDING") {
    findings.push({
      code: "LEDGER_PENDING",
      severity: "MEDIUM",
      message: "The ledger entry is still pending.",
    });
  }

  /*
   * Canonical transaction vs source status
   */

  if (
    transactionStatus === "SUCCESS" &&
    gatewayStatus === "FAILED"
  ) {
    findings.push({
      code: "TRANSACTION_GATEWAY_CONFLICT",
      severity: "HIGH",
      message:
        "The canonical transaction is marked successful, but the gateway reported a failure.",
    });
  }

  return {
    consistent: findings.length === 0,
    findings,
  };
};

export {
  checkStatusConsistency,
};