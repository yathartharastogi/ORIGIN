
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Database,
  Download,
  GitCompare,
  Loader2,
  MessageSquare,
  Send,
  Server,
  ShieldAlert,
  Sparkles,
  UserRound,
  XCircle,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getInvestigation,
  getInvestigationMessages,
  sendInvestigationMessage,
} from "@/services/investigation.api";

import { generateInvestigationReport } from "@/utils/generateInvestigationReport";

function formatDate(value) {
  if (!value) return "No timestamp";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No timestamp";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getStatusConfig(status) {
  switch (status) {
    case "SUCCESS":
    case "SETTLED":
    case "POSTED":
      return {
        icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/15",
      };

    case "PENDING":
      return {
        icon: CircleAlert,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/15",
      };

    case "FAILED":
    case "REJECTED":
    case "MISSING":
      return {
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/15",
      };

    default:
      return {
        icon: CircleAlert,
        color: "text-slate-400",
        bg: "bg-white/[0.04]",
        border: "border-white/[0.08]",
      };
  }
}

/* -------------------------------------------------------------------------- */
/* Timeline                                                                    */
/* -------------------------------------------------------------------------- */

function TransactionTimeline({ investigation }) {
  const evidence = investigation?.evidenceSnapshot;

  if (!evidence) return null;

  const gateway = evidence.gateway?.records?.[0];
  const bank = evidence.bank?.records?.[0];
  const ledger = evidence.ledger?.records?.[0];

  const events = [
    {
      system: "Gateway",
      icon: Server,
      status: gateway?.status || "MISSING",
      timestamp: gateway?.processedAt,
      reference: gateway?.gatewayReference,
      message:
        gateway?.responseMessage ||
        "Gateway record was not found.",
    },
    {
      system: "Bank",
      icon: Database,
      status: bank?.status || "MISSING",
      timestamp: bank?.settledAt || bank?.receivedAt,
      reference: bank?.bankReference,
      message:
        bank?.responseMessage ||
        "Bank record was not found.",
    },
    {
      system: "Ledger",
      icon: GitCompare,
      status: ledger?.status || "MISSING",
      timestamp: ledger?.postedAt,
      reference: ledger?.ledgerReference,
      message: ledger
        ? "Ledger entry recorded."
        : "No ledger record was found.",
    },
  ];

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#090c10] p-5 sm:p-6 lg:p-7">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-cyan-400" />

            <h2 className="text-sm font-semibold text-white">
              Transaction Timeline
            </h2>
          </div>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Chronological payment events across connected systems.
          </p>
        </div>

        <span className="hidden rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[8px] tracking-wider text-slate-700 sm:block">
          EVENT TRACE
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute bottom-6 left-5 top-6 w-px bg-white/[0.08]" />

        <div className="space-y-8">
          {events.map((event, index) => {
            const statusConfig = getStatusConfig(event.status);
            const StatusIcon = statusConfig.icon;
            const SystemIcon = event.icon;

            return (
              <motion.div
                key={event.system}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                className="relative flex gap-5"
              >
                {/* Node */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${statusConfig.border} bg-[#090c10]`}
                >
                  <SystemIcon
                    className={`h-4 w-4 ${statusConfig.color}`}
                  />

                  {event.status === "PENDING" && (
                    <span className="absolute inset-1 animate-ping rounded-full bg-amber-400/10" />
                  )}
                </div>

                {/* Event */}
                <div className="min-w-0 flex-1">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4.5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-sm font-semibold text-white">
                            {event.system}
                          </h3>

                          <div
                            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-semibold ${statusConfig.border} ${statusConfig.bg} ${statusConfig.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {event.status}
                          </div>
                        </div>

                        <p className="mt-2.5 max-w-2xl text-xs leading-5 text-slate-500">
                          {event.message}
                        </p>
                      </div>

                      <div className="shrink-0 sm:text-right">
                        <div className="font-mono text-[10px] text-slate-300">
                          {formatDate(event.timestamp)}
                        </div>

                        {event.timestamp && (
                          <div className="mt-1 text-[9px] text-slate-700">
                            Event timestamp
                          </div>
                        )}
                      </div>
                    </div>

                    {event.reference && (
                      <div className="mt-4 flex items-center gap-2 border-t border-white/[0.05] pt-3">
                        <span className="font-mono text-[9px] text-slate-700">
                          REFERENCE
                        </span>

                        <span className="font-mono text-[9px] text-slate-400">
                          {event.reference}
                        </span>
                      </div>
                    )}

                    {!event.timestamp && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-400/10 bg-red-400/[0.03] px-3 py-2.5">
                        <XCircle className="h-3.5 w-3.5 text-red-400" />

                        <span className="text-[10px] text-red-300">
                          No corresponding timestamp available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Pipeline                                                                    */
/* -------------------------------------------------------------------------- */

function PipelineCard({
  name,
  status,
  reference,
  icon: Icon,
}) {
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-5`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.07] bg-black/20">
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>

        <StatusIcon className={`h-4 w-4 ${config.color}`} />
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold text-white">
          {name}
        </div>

        <div
          className={`mt-1.5 font-mono text-[9px] font-semibold ${config.color}`}
        >
          {status}
        </div>

        {reference && (
          <div className="mt-3 truncate rounded-md border border-white/[0.05] bg-black/10 px-2 py-1.5 font-mono text-[8px] text-slate-600">
            {reference}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                       */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "cyan",
}) {
  const accentClasses = {
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/10",
    green:
      "text-emerald-400 bg-emerald-400/10 border-emerald-400/10",
    amber:
      "text-amber-400 bg-amber-400/10 border-amber-400/10",
    red: "text-red-400 bg-red-400/10 border-red-400/10",
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#090c10] p-4.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
          {label}
        </span>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accentClasses[accent]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3.5 truncate text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Evidence                                                                    */
/* -------------------------------------------------------------------------- */

function EvidenceIndicator({ label, exists }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          exists
            ? "bg-emerald-400/10"
            : "bg-red-400/10"
        }`}
      >
        {exists ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <XCircle className="h-4 w-4 text-red-400" />
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-slate-300">
          {label}
        </div>

        <div
          className={`mt-1 text-[9px] font-semibold ${
            exists
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {exists ? "EVIDENCE FOUND" : "MISSING"}
        </div>
      </div>
    </div>
  );
}

function EvidenceRow({
  label,
  exists,
  records,
  last,
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 ${
        !last ? "border-b border-white/[0.05]" : ""
      }`}
    >
      <div className="text-xs font-medium text-slate-400">
        {label}
      </div>

      <div className="flex items-center gap-4">
        <span className="font-mono text-[9px] text-slate-600">
          {records ?? 0} record
          {records === 1 ? "" : "s"}
        </span>

        <span
          className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
            exists
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-red-400/10 text-red-400"
          }`}
        >
          {exists ? "AVAILABLE" : "MISSING"}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                   */
/* -------------------------------------------------------------------------- */

export default function InvestigationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [investigation, setInvestigation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [error, setError] = useState("");

  async function loadInvestigation() {
    try {
      setLoading(true);
      setError("");

      const response = await getInvestigation(id);

      if (!response.success) {
        throw new Error(
          response.error?.message ||
            "Unable to load investigation."
        );
      }

      setInvestigation(
        response.data?.investigation ||
          response.data
      );
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          err?.message ||
          "Unable to load investigation."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    try {
      const response =
        await getInvestigationMessages(id);

      if (response.success) {
        setMessages(
          response.data?.messages ||
            response.data ||
            []
        );
      }
    } catch (err) {
      console.error(
        "Unable to load chat history:",
        err
      );
    }
  }

  useEffect(() => {
    loadInvestigation();
    loadMessages();
  }, [id]);

  async function handleSendMessage(event) {
    event.preventDefault();

    const content = chatInput.trim();

    if (!content || !investigation) {
      return;
    }

    try {
      setChatLoading(true);

      const response =
        await sendInvestigationMessage(
          investigation.investigationId,
          content
        );

      if (!response.success) {
        throw new Error(
          response.error?.message ||
            "Unable to send message."
        );
      }

      setChatInput("");

      await loadMessages();
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          err?.message ||
          "Unable to send message."
      );
    } finally {
      setChatLoading(false);
    }
  }

  function handleSuggestedQuestion(question) {
    setChatInput(question);
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />

          <span className="text-sm">
            Loading investigation...
          </span>
        </div>
      </div>
    );
  }

  if (error && !investigation) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="rounded-xl border border-red-400/15 bg-red-400/[0.04] p-6">
          <div className="text-sm font-semibold text-red-300">
            Unable to load investigation
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!investigation) {
    return null;
  }

  const evidence =
    investigation.evidenceSnapshot || {};

  const gateway =
    evidence.gateway?.records?.[0];

  const bank =
    evidence.bank?.records?.[0];

  const ledger =
    evidence.ledger?.records?.[0];

  const reconciliation =
    investigation.reconciliation || {};

  const ai =
    investigation.aiAnalysis || {};

  const rootCause =
    ai.rootCause || {};

  const resolution =
    ai.resolution || {};

  const support =
    ai.support || {};

  const anomalyList =
    investigation.anomalies ||
    reconciliation.findings ||
    [];

  const finding =
    investigation.overallFinding ||
    reconciliation.overallFinding ||
    "UNKNOWN";

  const severity =
    investigation.severity ||
    reconciliation.severity ||
    "UNKNOWN";

  const severityColor =
    severity === "CRITICAL"
      ? "text-red-400"
      : severity === "HIGH"
        ? "text-orange-400"
        : severity === "MEDIUM"
          ? "text-amber-400"
          : "text-emerald-400";

  const suggestedQuestions = [
    "Why is this transaction pending?",
    "What caused the reconciliation issue?",
    "What should the support team do next?",
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-[1380px] px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to investigations
            </button>

            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-slate-700 sm:block">
              INVESTIGATION CONSOLE
            </span>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-mono text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
                  {investigation.transactionId}
                </h1>

                <span
                  className={`rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold tracking-wider ${severityColor}`}
                >
                  {severity} SEVERITY
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Investigation{" "}
                <span className="font-mono text-slate-400">
                  {investigation.investigationId}
                </span>
              </p>
            </div>

            <button
              onClick={() =>
                generateInvestigationReport(
                  investigation
                )
              }
              className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Error                                                            */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/[0.03] px-4 py-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Overview Stats                                                   */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            label="Evidence Score"
            value={`${investigation.evidenceScore ?? 0}%`}
            icon={ShieldAlert}
            accent="cyan"
          />

          <StatCard
            label="Overall Finding"
            value={finding}
            icon={GitCompare}
            accent={
              finding === "SUCCESS"
                ? "green"
                : "amber"
            }
          />

          <StatCard
            label="Investigation Status"
            value={
              investigation.status || "UNKNOWN"
            }
            icon={Zap}
            accent="cyan"
          />

          <StatCard
            label="AI Confidence"
            value={
              rootCause.confidence != null
                ? `${rootCause.confidence}%`
                : "N/A"
            }
            icon={Bot}
            accent="green"
          />
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Payment Pipeline                                                  */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-white/[0.07] bg-[#090c10] p-5 sm:p-6 lg:p-7"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Payment Pipeline
              </h2>

              <p className="mt-1.5 text-xs text-slate-500">
                Evidence status across connected systems.
              </p>
            </div>

            <span className="hidden rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[8px] tracking-wider text-slate-700 sm:block">
              TRACE / RECONCILE / EXPLAIN
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <PipelineCard
              name="Gateway"
              status={gateway?.status || "MISSING"}
              reference={
                gateway?.gatewayReference
              }
              icon={Server}
            />

            <PipelineCard
              name="Bank"
              status={bank?.status || "MISSING"}
              reference={bank?.bankReference}
              icon={Database}
            />

            <PipelineCard
              name="Ledger"
              status={ledger?.status || "MISSING"}
              reference={
                ledger?.ledgerReference
              }
              icon={GitCompare}
            />
          </div>
        </motion.section>

        {/* ---------------------------------------------------------------- */}
        {/* Timeline                                                          */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mb-6"
        >
          <TransactionTimeline
            investigation={investigation}
          />
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Main Grid                                                         */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* Left */}
          <div className="min-w-0 space-y-6">
            {/* Reconciliation */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="rounded-2xl border border-white/[0.07] bg-[#090c10] p-5 sm:p-6 lg:p-7"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06]">
                  <GitCompare className="h-4 w-4 text-cyan-400" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Reconciliation
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Deterministic comparison of payment evidence.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <EvidenceIndicator
                  label="Gateway"
                  exists={
                    reconciliation.summary
                      ?.gatewayExists ??
                    evidence.gateway?.exists
                  }
                />

                <EvidenceIndicator
                  label="Bank"
                  exists={
                    reconciliation.summary
                      ?.bankExists ??
                    evidence.bank?.exists
                  }
                />

                <EvidenceIndicator
                  label="Ledger"
                  exists={
                    reconciliation.summary
                      ?.ledgerExists ??
                    evidence.ledger?.exists
                  }
                />
              </div>

              {anomalyList.length > 0 && (
                <div className="mt-6 space-y-2.5">
                  {anomalyList.map(
                    (anomaly, index) => (
                      <div
                        key={`${anomaly.code}-${index}`}
                        className="flex gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.03] p-4"
                      >
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                        <div>
                          <div className="text-xs font-semibold text-red-300">
                            {anomaly.code ||
                              "RECONCILIATION ISSUE"}
                          </div>

                          <p className="mt-1.5 text-xs leading-5 text-slate-500">
                            {anomaly.message}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </motion.section>

            {/* AI Root Cause */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5 sm:p-6 lg:p-7"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/10">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    AI Root Cause
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Evidence-backed explanation
                  </p>
                </div>

                {rootCause.confidence != null && (
                  <div className="ml-auto rounded-md border border-cyan-400/10 bg-cyan-400/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-cyan-300">
                    {rootCause.confidence}% confidence
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.05] bg-black/10 p-4">
                <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-400">
                  Root Cause
                </div>

                <p className="text-sm leading-7 text-slate-300">
                  {rootCause.rootCause ||
                    "No AI root cause analysis available."}
                </p>
              </div>

              {rootCause.supportingEvidence
                ?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                    Supporting Evidence
                  </div>

                  <div className="space-y-2">
                    {rootCause.supportingEvidence.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg border border-white/[0.05] bg-black/10 p-3.5"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />

                          <span className="text-xs leading-5 text-slate-500">
                            {item}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {rootCause.uncertainties
                ?.length > 0 && (
                <div className="mt-6 rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-4">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-400">
                    Uncertainties
                  </div>

                  <div className="space-y-2">
                    {rootCause.uncertainties.map(
                      (item, index) => (
                        <p
                          key={index}
                          className="text-xs leading-5 text-slate-500"
                        >
                          • {item}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}
            </motion.section>

            {/* Recommended Action */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="rounded-2xl border border-white/[0.07] bg-[#090c10] p-5 sm:p-6 lg:p-7"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/10 bg-amber-400/[0.06]">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Recommended Action
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Suggested next steps for the support team.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-4.5">
                <p className="text-sm leading-6 text-slate-300">
                  {resolution.recommendedAction ||
                    "No recommended action available."}
                </p>
              </div>

              {resolution.steps?.length > 0 && (
                <div className="mt-6 space-y-3">
                  {resolution.steps.map(
                    (step, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] font-mono text-[9px] text-slate-500">
                          {index + 1}
                        </div>

                        <p className="pt-1 text-xs leading-5 text-slate-500">
                          {step}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}

              {resolution.escalationRequired && (
                <div className="mt-6 flex gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.03] p-4">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />

                  <div>
                    <div className="text-xs font-semibold text-red-300">
                      Escalation Required
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {resolution.escalationReason ||
                        "This investigation requires escalation."}
                    </p>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Support Summary */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/[0.07] bg-[#090c10] p-5 sm:p-6 lg:p-7"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06]">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Support Summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    AI-generated communication material for support.
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-400">
                {support.summary ||
                  "No support summary available."}
              </p>

              {support.customerMessage && (
                <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                    Customer Message
                  </div>

                  <p className="mt-2.5 text-xs leading-6 text-slate-500">
                    {support.customerMessage}
                  </p>
                </div>
              )}

              {support.internalNote && (
                <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                    Internal Note
                  </div>

                  <p className="mt-2.5 text-xs leading-6 text-slate-500">
                    {support.internalNote}
                  </p>
                </div>
              )}
            </motion.section>

            {/* Evidence Details */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="rounded-2xl border border-white/[0.07] bg-[#090c10] p-5 sm:p-6 lg:p-7"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06]">
                  <Database className="h-4 w-4 text-cyan-400" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Evidence Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Availability of evidence collected from each system.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <div className="min-w-[600px] rounded-xl border border-white/[0.06]">
                  <EvidenceRow
                    label="Gateway"
                    exists={evidence.gateway?.exists}
                    records={
                      evidence.gateway?.recordCount
                    }
                  />

                  <EvidenceRow
                    label="Bank"
                    exists={evidence.bank?.exists}
                    records={
                      evidence.bank?.recordCount
                    }
                  />

                  <EvidenceRow
                    label="Ledger"
                    exists={evidence.ledger?.exists}
                    records={
                      evidence.ledger?.recordCount
                    }
                    last
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-700">
                <Clock3 className="h-3 w-3" />
                Collected at{" "}
                {formatDate(
                  evidence.collectedAt
                )}
              </div>
            </motion.section>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Chat                                                              */}
          {/* ---------------------------------------------------------------- */}

          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:sticky xl:top-6 xl:h-[calc(100vh-7rem)]"
          >
            <div className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090c10]">
              {/* Chat Header */}
              <div className="border-b border-white/[0.06] px-5 py-4.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/10">
                    <Bot className="h-4 w-4 text-cyan-400" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      Ask LedgerLens
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Investigation-aware AI
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                {messages.length === 0 && (
                  <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                      <Bot className="h-5 w-5 text-slate-700" />
                    </div>

                    <p className="mt-4 text-xs font-medium text-slate-500">
                      Ask anything about this investigation.
                    </p>

                    <p className="mt-1.5 max-w-[230px] text-[10px] leading-5 text-slate-700">
                      LedgerLens will answer using the investigation context and verified evidence.
                    </p>
                  </div>
                )}

                {messages.map((message, index) => {
                  const isUser =
                    message.role === "USER";

                  return (
                    <div
                      key={
                        message._id ||
                        message.id ||
                        index
                      }
                      className={`flex gap-3 ${
                        isUser
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isUser
                            ? "bg-white/[0.06]"
                            : "bg-cyan-400/10"
                        }`}
                      >
                        {isUser ? (
                          <UserRound className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 text-cyan-400" />
                        )}
                      </div>

                      <div
                        className={`max-w-[82%] rounded-xl px-3.5 py-3 ${
                          isUser
                            ? "bg-white/[0.06] text-slate-300"
                            : "border border-white/[0.06] bg-white/[0.025] text-slate-400"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-xs leading-5">
                          {message.content}
                        </p>

                        {message.createdAt && (
                          <p className="mt-2 text-[8px] text-slate-700">
                            {formatDate(
                              message.createdAt
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {chatLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10">
                      <Bot className="h-3.5 w-3.5 text-cyan-400" />
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />

                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:120ms]" />

                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions */}
              <div className="border-t border-white/[0.06] px-4 py-3.5">
                <div className="mb-2.5 text-[9px] uppercase tracking-[0.15em] text-slate-700">
                  Suggested questions
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {suggestedQuestions.map(
                    (question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() =>
                          handleSuggestedQuestion(
                            question
                          )
                        }
                        className="shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10px] text-slate-500 transition hover:border-cyan-400/15 hover:bg-cyan-400/[0.03] hover:text-cyan-300"
                      >
                        {question}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-white/[0.06] p-4"
              >
                <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-2 transition focus-within:border-cyan-400/20"
                >
                  <textarea
                    value={chatInput}
                    onChange={(event) =>
                      setChatInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (!chatLoading) {
                          event.currentTarget.form?.requestSubmit();
                        }
                      }
                    }}
                    placeholder="Ask about this transaction..."
                    rows={2}
                    disabled={chatLoading}
                    className="min-h-[44px] flex-1 resize-none bg-transparent px-2 py-1.5 text-xs text-slate-300 outline-none placeholder:text-slate-700 disabled:opacity-50"
                  />

                  <button
                    type="submit"
                    disabled={
                      chatLoading ||
                      !chatInput.trim()
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {chatLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="mt-2.5 text-center text-[9px] text-slate-700">
                  AI answers are grounded in investigation evidence.
                </p>
              </form>
            </div>
          </motion.aside>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] py-5">
          <div className="flex items-center gap-2 text-[9px] text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            LedgerLens Investigation Engine
          </div>

          <div className="flex items-center gap-3 text-[9px] text-slate-700">
            <span>Code decides facts</span>
            <span>•</span>
            <span>AI explains facts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
