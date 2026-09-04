const getAgentPlan = ({
  overallFinding,
}) => {
  /*
   * Successful transaction:
   * no AI analysis is necessary.
   */
  if (overallFinding === "SUCCESS") {
    return {
      rootCause: false,
      resolution: false,
      support: false,
    };
  }

  /*
   * Missing evidence:
   * explain what is known and what is missing,
   * but don't recommend unsupported actions.
   */
  if (overallFinding === "MISSING_EVIDENCE") {
  return {
    rootCause: true,
    resolution: true,
    support: true,
  };
}

  /*
   * Known transaction problems:
   * run the complete AI pipeline.
   */
  const requiresFullAnalysis = [
    "SETTLEMENT_DELAYED",
    "SETTLEMENT_FAILED",
    "AMOUNT_MISMATCH",
    "INCONSISTENT",
  ];

  if (requiresFullAnalysis.includes(overallFinding)) {
    return {
      rootCause: true,
      resolution: true,
      support: true,
    };
  }

  /*
   * Unknown situation:
   * explain what is known without making
   * unsupported operational recommendations.
   */
  return {
    rootCause: true,
    resolution: false,
    support: true,
  };
};

export {
  getAgentPlan,
};