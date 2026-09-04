const checkDuplicateRecords = ({
  gateway,
  bank,
  ledger,
}) => {
  const findings = [];

  const sources = [
    {
      name: "GATEWAY",
      data: gateway,
      code: "DUPLICATE_GATEWAY_RECORD",
    },
    {
      name: "BANK",
      data: bank,
      code: "DUPLICATE_BANK_RECORD",
    },
    {
      name: "LEDGER",
      data: ledger,
      code: "DUPLICATE_LEDGER_RECORD",
    },
  ];

  for (const source of sources) {
    const recordCount = source.data?.recordCount || 0;

    if (recordCount > 1) {
      findings.push({
        code: source.code,
        severity: "HIGH",
        message: `Multiple ${source.name.toLowerCase()} records were found for the transaction.`,
        details: {
          recordCount,
        },
      });
    }
  }

  return findings;
};

export {
  checkDuplicateRecords,
};