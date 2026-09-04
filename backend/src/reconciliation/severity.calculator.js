const severityPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const calculateSeverity = (findings = []) => {
  if (findings.length === 0) {
    return "LOW";
  }

  const highestSeverity = findings.reduce((highest, finding) => {
    const currentPriority = severityPriority[finding.severity] || 0;
    const highestPriority = severityPriority[highest] || 0;

    return currentPriority > highestPriority
      ? finding.severity
      : highest;
  }, "LOW");

  // Multiple serious findings indicate a critical investigation.
  const highSeverityCount = findings.filter(
    (finding) =>
      finding.severity === "HIGH" ||
      finding.severity === "CRITICAL"
  ).length;

  if (highSeverityCount >= 2) {
    return "CRITICAL";
  }

  return highestSeverity;
};

export {
  calculateSeverity,
};