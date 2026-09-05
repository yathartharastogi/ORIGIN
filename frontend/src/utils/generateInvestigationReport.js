
import jsPDF from "jspdf";

export function generateInvestigationReport(investigation) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  const colors = {
    black: [10, 13, 18],
    gray: [100, 110, 125],
    lightGray: [235, 238, 242],
    cyan: [8, 145, 178],
    green: [22, 163, 74],
    amber: [217, 119, 6],
    red: [220, 38, 38],
  };

  function addPageIfNeeded(height = 15) {
    if (y + height > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  }

  function sectionTitle(title) {
    addPageIfNeeded(20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...colors.black);
    doc.text(title, margin, y);

    y += 8;

    doc.setDrawColor(...colors.lightGray);
    doc.line(margin, y, pageWidth - margin, y);

    y += 8;
  }

  function labelValue(label, value) {
    addPageIfNeeded(12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...colors.gray);
    doc.text(label, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.black);

    doc.text(String(value ?? "N/A"), margin + 42, y);

    y += 7;
  }

  function paragraph(text, options = {}) {
    if (!text) return;

    const fontSize = options.fontSize || 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...colors.black);

    const lines = doc.splitTextToSize(
      String(text),
      contentWidth
    );

    addPageIfNeeded(lines.length * 5 + 4);

    doc.text(lines, margin, y);

    y += lines.length * 5 + 5;
  }

  function bullet(text) {
    if (!text) return;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.black);

    const lines = doc.splitTextToSize(
      String(text),
      contentWidth - 7
    );

    addPageIfNeeded(lines.length * 5 + 5);

    doc.text("•", margin, y);
    doc.text(lines, margin + 5, y);

    y += lines.length * 5 + 4;
  }

  function statusColor(status) {
    if (status === "SUCCESS" || status === "POSTED") {
      return colors.green;
    }

    if (status === "PENDING") {
      return colors.amber;
    }

    if (
      status === "MISSING" ||
      status === "FAILED" ||
      status === "REJECTED"
    ) {
      return colors.red;
    }

    return colors.gray;
  }

  function pipelineRow(name, exists, record) {
    addPageIfNeeded(18);

    const status = exists
      ? record?.status || "AVAILABLE"
      : "MISSING";

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(
      margin,
      y - 5,
      contentWidth,
      13,
      2,
      2,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.black);
    doc.text(name, margin + 5, y + 3);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...statusColor(status));
    doc.text(
      status,
      pageWidth - margin - 5,
      y + 3,
      { align: "right" }
    );

    y += 18;
  }

  // --------------------------------------------------
  // Header
  // --------------------------------------------------

  doc.setFillColor(...colors.black);
  doc.rect(0, 0, pageWidth, 42, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(255, 255, 255);
  doc.text("LedgerLens", margin, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(180, 190, 200);
  doc.text(
    "PAYMENT INVESTIGATION REPORT",
    margin,
    27
  );

  doc.setFontSize(8);
  doc.text(
    new Date().toLocaleString(),
    pageWidth - margin,
    18,
    { align: "right" }
  );

  y = 56;

  // --------------------------------------------------
  // Investigation Overview
  // --------------------------------------------------

  sectionTitle("Investigation Overview");

  labelValue(
    "Investigation ID",
    investigation?.investigationId
  );

  labelValue(
    "Transaction ID",
    investigation?.transactionId
  );

  labelValue(
    "Status",
    investigation?.status
  );

  labelValue(
    "Severity",
    investigation?.severity
  );

  labelValue(
    "Finding",
    investigation?.overallFinding
  );

  labelValue(
    "Evidence Score",
    investigation?.evidenceScore != null
      ? `${investigation.evidenceScore}%`
      : "N/A"
  );

  // --------------------------------------------------
  // Transaction Pipeline
  // --------------------------------------------------

  sectionTitle("Transaction Pipeline");

  const evidence =
    investigation?.evidenceSnapshot || {};

  const gateway = evidence.gateway;
  const bank = evidence.bank;
  const ledger = evidence.ledger;

  pipelineRow(
    "Gateway",
    gateway?.exists,
    gateway?.records?.[0]
  );

  pipelineRow(
    "Bank",
    bank?.exists,
    bank?.records?.[0]
  );

  pipelineRow(
    "Ledger",
    ledger?.exists,
    ledger?.records?.[0]
  );

  // --------------------------------------------------
  // Transaction Details
  // --------------------------------------------------

  sectionTitle("Transaction Details");

  const transactionRecord =
    evidence?.gateway?.records?.[0] ||
    evidence?.bank?.records?.[0];

  if (transactionRecord) {
    labelValue(
      "Amount",
      transactionRecord.amount != null
        ? `${transactionRecord.amount} ${transactionRecord.currency || ""}`
        : "N/A"
    );

    labelValue(
      "Currency",
      transactionRecord.currency
    );

    if (transactionRecord.gatewayReference) {
      labelValue(
        "Gateway Reference",
        transactionRecord.gatewayReference
      );
    }

    if (transactionRecord.bankReference) {
      labelValue(
        "Bank Reference",
        transactionRecord.bankReference
      );
    }

    if (transactionRecord.settlementBatchId) {
      labelValue(
        "Settlement Batch",
        transactionRecord.settlementBatchId
      );
    }
  }

  // --------------------------------------------------
  // Reconciliation
  // --------------------------------------------------

  sectionTitle("Reconciliation Findings");

  const reconciliation =
    investigation?.reconciliation;

  labelValue(
    "Overall Finding",
    reconciliation?.overallFinding ||
      investigation?.overallFinding
  );

  labelValue(
    "Severity",
    reconciliation?.severity ||
      investigation?.severity
  );

  labelValue(
    "Consistent",
    reconciliation?.consistent
      ? "Yes"
      : "No"
  );

  const findings =
    reconciliation?.findings ||
    investigation?.anomalies ||
    [];

  if (findings.length > 0) {
    y += 2;

    findings.forEach((finding) => {
      bullet(
        `${finding.code || "Finding"}: ${
          finding.message || "No description available."
        }`
      );
    });
  } else {
    paragraph(
      "No reconciliation findings were recorded."
    );
  }

  // --------------------------------------------------
  // AI Root Cause
  // --------------------------------------------------

  sectionTitle("AI Root Cause Analysis");

  const rootCause =
    investigation?.aiAnalysis?.rootCause;

  if (rootCause) {
    paragraph(rootCause.rootCause);

    labelValue(
      "AI Confidence",
      rootCause.confidence != null
        ? `${rootCause.confidence}%`
        : "N/A"
    );

    if (
      rootCause.supportingEvidence?.length
    ) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.black);
      doc.text(
        "Supporting Evidence",
        margin,
        y
      );

      y += 7;

      rootCause.supportingEvidence.forEach(
        (item) => bullet(item)
      );
    }

    if (rootCause.uncertainties?.length) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.black);
      doc.text(
        "Uncertainties",
        margin,
        y
      );

      y += 7;

      rootCause.uncertainties.forEach(
        (item) => bullet(item)
      );
    }
  } else {
    paragraph(
      "AI root cause analysis is not available."
    );
  }

  // --------------------------------------------------
  // Recommended Action
  // --------------------------------------------------

  sectionTitle("Recommended Action");

  const resolution =
    investigation?.aiAnalysis?.resolution;

  if (resolution) {
    paragraph(
      resolution.recommendedAction
    );

    labelValue(
      "Priority",
      resolution.priority
    );

    labelValue(
      "Escalation Required",
      resolution.escalationRequired
        ? "Yes"
        : "No"
    );

    if (resolution.escalationReason) {
      labelValue(
        "Escalation Reason",
        resolution.escalationReason
      );
    }

    if (resolution.steps?.length) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.black);
      doc.text(
        "Recommended Steps",
        margin,
        y
      );

      y += 7;

      resolution.steps.forEach(
        (step, index) => {
          bullet(`${index + 1}. ${step}`);
        }
      );
    }
  } else {
    paragraph(
      "No recommended action is available."
    );
  }

  // --------------------------------------------------
  // Support Summary
  // --------------------------------------------------

  sectionTitle("Support Summary");

  const support =
    investigation?.aiAnalysis?.support;

  if (support) {
    paragraph(support.summary);

    if (support.customerMessage) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.black);
      doc.text(
        "Customer Message",
        margin,
        y
      );

      y += 7;

      paragraph(support.customerMessage);
    }

    if (support.internalNote) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.black);
      doc.text(
        "Internal Note",
        margin,
        y
      );

      y += 7;

      paragraph(support.internalNote);
    }
  } else {
    paragraph(
      "No support summary is available."
    );
  }

  // --------------------------------------------------
  // Footer on every page
  // --------------------------------------------------

  const totalPages =
    doc.internal.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);

    doc.setDrawColor(...colors.lightGray);
    doc.line(
      margin,
      pageHeight - 13,
      pageWidth - margin,
      pageHeight - 13
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...colors.gray);

    doc.text(
      "LedgerLens • Payment Investigation Intelligence",
      margin,
      pageHeight - 7
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: "right" }
    );
  }

  // --------------------------------------------------
  // Download
  // --------------------------------------------------

  const transactionId =
    investigation?.transactionId ||
    "investigation";

  doc.save(
    `LedgerLens-Investigation-${transactionId}.pdf`
  );
}

