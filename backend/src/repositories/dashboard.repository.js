import Investigation from "../models/Investigation.js";


const getDashboardSummary = async () => {
  const [
    totalInvestigations,
    completedInvestigations,
    highSeverity,
    criticalSeverity,
    missingEvidence,
    settlementDelayed,
    settlementFailed,
    amountMismatch,
    inconsistent,
  ] = await Promise.all([
    Investigation.countDocuments(),

    Investigation.countDocuments({
      status: "COMPLETED",
    }),

    Investigation.countDocuments({
      severity: "HIGH",
    }),

    Investigation.countDocuments({
      severity: "CRITICAL",
    }),

    Investigation.countDocuments({
      overallFinding: "MISSING_EVIDENCE",
    }),

    Investigation.countDocuments({
      overallFinding: "SETTLEMENT_DELAYED",
    }),

    Investigation.countDocuments({
      overallFinding: "SETTLEMENT_FAILED",
    }),

    Investigation.countDocuments({
      overallFinding: "AMOUNT_MISMATCH",
    }),

    Investigation.countDocuments({
      overallFinding: "INCONSISTENT",
    }),
  ]);

  return {
    totalInvestigations,
    completedInvestigations,
    highSeverity,
    criticalSeverity,
    missingEvidence,
    settlementDelayed,
    settlementFailed,
    amountMismatch,
    inconsistent,
  };
};


export {
  getDashboardSummary,
};