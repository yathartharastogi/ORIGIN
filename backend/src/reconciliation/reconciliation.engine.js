import { checkAmountConsistency } from "./rules/amount.rule.js";
import { checkMissingRecords } from "./rules/missingRecord.rule.js";
import { checkDuplicateRecords } from "./rules/duplicate.rule.js";
import { checkStatusConsistency } from "./rules/status.rule.js";
import { checkTimelineConsistency } from "./rules/timeline.rule.js";

import { calculateSeverity } from "./severity.calculator.js";

const reconcileTransaction = ({
  transaction,
  evidence,
}) => {
  const {
    gateway,
    bank,
    ledger,
  } = evidence;

  /*
   * Run all reconciliation rules
   */

  const amountResult = checkAmountConsistency({
    transaction,
    gateway,
    bank,
    ledger,
  });

  const missingFindings = checkMissingRecords({
    gateway,
    bank,
    ledger,
  });

  const duplicateFindings = checkDuplicateRecords({
    gateway,
    bank,
    ledger,
  });

  const statusResult = checkStatusConsistency({
    transaction,
    gateway,
    bank,
    ledger,
  });

  const timelineResult = checkTimelineConsistency({
    gateway,
    bank,
    ledger,
  });

  /*
   * Combine findings from every rule
   */

  const findings = [];

  if (amountResult.finding) {
    findings.push(amountResult.finding);
  }

  findings.push(...missingFindings);
  findings.push(...duplicateFindings);
  findings.push(...statusResult.findings);
  findings.push(...timelineResult.findings);

  /*
   * Calculate overall severity
   */

  const severity = calculateSeverity(findings);

  /*
   * Determine overall finding
   */

  const overallFinding = determineOverallFinding({
    transaction,
    gateway,
    bank,
    ledger,
    findings,
  });

  return {
    transactionId: transaction.transactionId,

    overallFinding,

    severity,

    consistent: findings.length === 0,

    findings,

    summary: {
      gatewayExists: gateway.exists,
      bankExists: bank.exists,
      ledgerExists: ledger.exists,
    },
  };
};


/*
 * Determine the business-level result
 */

const determineOverallFinding = ({
  gateway,
  bank,
  ledger,
  findings,
}) => {
  const findingCodes = findings.map(
    (finding) => finding.code
  );

  // Amount mismatch has high priority
  if (findingCodes.includes("AMOUNT_MISMATCH")) {
    return "AMOUNT_MISMATCH";
  }

  // Bank rejected/failed the settlement
  if (
    findingCodes.includes("BANK_REJECTED") ||
    findingCodes.includes("BANK_FAILED")
  ) {
    return "SETTLEMENT_FAILED";
  }

  // Bank is waiting for settlement
  if (
    findingCodes.includes("BANK_PENDING") &&
    !ledger.exists
  ) {
    return "SETTLEMENT_DELAYED";
  }

  // Everything is present and no problems were found
  if (
    gateway.exists &&
    bank.exists &&
    ledger.exists &&
    findings.length === 0
  ) {
    return "SUCCESS";
  }

  // Evidence is incomplete
  if (
    !gateway.exists ||
    !bank.exists ||
    !ledger.exists
  ) {
    return "MISSING_EVIDENCE";
  }

  // Something went wrong but doesn't match
  // one of our known business scenarios
  if (findings.length > 0) {
    return "INCONSISTENT";
  }

  return "UNKNOWN";
};

export {
  reconcileTransaction,
};