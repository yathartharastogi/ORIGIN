const checkMissingRecords = ({
  gateway,
  bank,
  ledger,
}) => {
  const findings = [];

  if (!gateway?.exists) {
    findings.push({
      code: "GATEWAY_MISSING",
      severity: "HIGH",
      message: "Gateway record was not found.",
    });
  }

  if (!bank?.exists) {
    findings.push({
      code: "BANK_MISSING",
      severity: "HIGH",
      message: "Bank record was not found.",
    });
  }

  if (!ledger?.exists) {
    findings.push({
      code: "LEDGER_MISSING",
      severity: "HIGH",
      message: "Ledger record was not found.",
    });
  }

  return findings;
};

export {
  checkMissingRecords,
};