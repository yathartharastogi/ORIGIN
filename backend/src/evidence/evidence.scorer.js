const calculateEvidenceScore = (evidence) => {
  if (!evidence) {
    return 0;
  }

  const sources = [
    evidence.gateway,
    evidence.bank,
    evidence.ledger,
  ];

  const availableSources = sources.filter(
    (source) => source?.exists
  ).length;

  return Math.round(
    (availableSources / sources.length) * 100
  );
};

export {
  calculateEvidenceScore,
};