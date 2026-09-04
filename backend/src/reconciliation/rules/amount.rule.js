const checkAmountConsistency = ({
  transaction,
  gateway,
  bank,
  ledger,
}) => {
  const sources = [];

  if (transaction) {
    sources.push({
      source: "TRANSACTION",
      amount: transaction.amount,
    });
  }

  if (gateway?.record) {
    sources.push({
      source: "GATEWAY",
      amount: gateway.record.amount,
    });
  }

  if (bank?.record) {
    sources.push({
      source: "BANK",
      amount: bank.record.amount,
    });
  }

  if (ledger?.record) {
    sources.push({
      source: "LEDGER",
      amount: ledger.record.amount,
    });
  }

  if (sources.length <= 1) {
    return {
      matched: true,
      finding: null,
    };
  }

  const expectedAmount = transaction?.amount;

  if (expectedAmount === undefined) {
    return {
      matched: false,
      finding: {
        code: "MISSING_TRANSACTION_AMOUNT",
        severity: "HIGH",
        message: "Canonical transaction amount is unavailable.",
      },
    };
  }

  const mismatches = sources.filter(
    (item) => item.amount !== expectedAmount
  );

  if (mismatches.length === 0) {
    return {
      matched: true,
      finding: null,
    };
  }

  return {
    matched: false,
    finding: {
      code: "AMOUNT_MISMATCH",
      severity: "HIGH",
      message: "Transaction amounts differ across systems.",
      details: {
        expectedAmount,
        sources,
        mismatches,
      },
    },
  };
};

export {
  checkAmountConsistency,
};