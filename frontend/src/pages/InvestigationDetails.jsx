import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Database,
  GitCompare,
  Loader2,
  MessageSquare,
  Send,
  Server,
  ShieldAlert,
  UserRound,
  XCircle,
  Zap,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PageTransition from "@/components/layout/PageTransition";

import {
  getInvestigation,
  getInvestigationMessages,
  sendInvestigationMessage,
} from "@/services/investigation.api";


/* =========================================================
   SEVERITY BADGE
========================================================= */

function SeverityBadge({ severity }) {
  const styles = {
    LOW: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    MEDIUM: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    HIGH: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    CRITICAL: "border-red-500/20 bg-red-500/10 text-red-400",
  };

  return (
    <Badge
      variant="outline"
      className={`tracking-wider ${
        styles[severity] || styles.MEDIUM
      }`}
    >
      {severity || "UNKNOWN"}
    </Badge>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const completed = status === "COMPLETED";

  return (
    <Badge
      variant="outline"
      className={
        completed
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
      }
    >
      {completed ? (
        <CheckCircle2 className="mr-1.5 h-3 w-3" />
      ) : (
        <Clock3 className="mr-1.5 h-3 w-3" />
      )}

      {status?.replaceAll("_", " ") || "UNKNOWN"}
    </Badge>
  );
}


/* =========================================================
   SYSTEM ICON
========================================================= */

function SystemIcon({ system }) {
  if (system === "gateway") {
    return <Server className="h-5 w-5" />;
  }

  if (system === "bank") {
    return <Database className="h-5 w-5" />;
  }

  return <GitCompare className="h-5 w-5" />;
}


/* =========================================================
   SYSTEM NODE
========================================================= */

function SystemNode({
  name,
  system,
  exists,
  status,
  amount,
}) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          exists
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        <SystemIcon system={system} />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-3">

          <p className="text-sm font-medium text-white">
            {name}
          </p>

          {exists ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <XCircle className="h-4 w-4 text-red-400" />
          )}

        </div>

        <div className="mt-1 flex items-center gap-2">

          <span
            className={`text-xs ${
              exists
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {exists ? status || "PRESENT" : "MISSING"}
          </span>

          {amount !== undefined && (
            <>
              <span className="text-slate-700">
                •
              </span>

              <span className="text-xs text-slate-500">
                ₹{Number(amount).toLocaleString()}
              </span>
            </>
          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   PIPELINE CONNECTOR
========================================================= */

function PipelineConnector({ active = false }) {
  return (
    <div className="hidden w-12 items-center justify-center lg:flex">

      <div className="relative h-px w-full bg-white/[0.08]">

        {active && (
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />
        )}

      </div>

    </div>
  );
}


/* =========================================================
   EVIDENCE ROW
========================================================= */

function EvidenceRow({
  title,
  value,
  exists,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.05] last:border-0">

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >

        <div className="flex items-center gap-3">

          {exists ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <XCircle className="h-4 w-4 text-red-400" />
          )}

          <span className="text-sm text-slate-300">
            {title}
          </span>

        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {open && value && (
        <div className="px-5 pb-5">

          <pre className="max-h-80 overflow-auto rounded-xl border border-white/[0.05] bg-black/20 p-4 text-xs leading-6 text-slate-400">
            {JSON.stringify(value, null, 2)}
          </pre>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   SCORE RING
========================================================= */

function ScoreRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (score / 100) * circumference;

  return (
    <div className="relative h-36 w-36">

      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
      >

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/[0.06]"
        />

        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-cyan-400"
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          strokeDasharray={circumference}
        />

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <span className="text-3xl font-semibold text-white">
          {score}
        </span>

        <span className="text-[10px] uppercase tracking-wider text-slate-500">
          Evidence
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function InvestigationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();


  /* Investigation state */
  const [investigation, setInvestigation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* Chat state */
  const [messages, setMessages] =
    useState([]);

  const [messageInput, setMessageInput] =
    useState("");

  const [chatLoading, setChatLoading] =
    useState(false);

  const [chatError, setChatError] =
    useState("");


  /* =======================================================
     LOAD INVESTIGATION
  ======================================================= */

  useEffect(() => {
    async function loadInvestigation() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getInvestigation(id);

        if (!response.success) {
          throw new Error(
            response.error?.message ||
              "Unable to load investigation."
          );
        }

        setInvestigation(response.data);


        /* Load chat history */
        try {
          const chatResponse =
            await getInvestigationMessages(id);

          if (chatResponse.success) {
            setMessages(
              Array.isArray(chatResponse.data)
                ? chatResponse.data
                : chatResponse.data?.messages || []
            );
          }
        } catch (chatErr) {
          console.error(
            "Chat history error:",
            chatErr
          );
        }

      } catch (err) {
        console.error(
          "Investigation error:",
          err
        );

        setError(
          err.response?.data?.error?.message ||
            err.message ||
            "Unable to load investigation."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadInvestigation();
    }
  }, [id]);


  /* =======================================================
     SEND CHAT MESSAGE
  ======================================================= */

  async function handleSendMessage(event) {
    event.preventDefault();

    const content =
      messageInput.trim();

    if (
      !content ||
      chatLoading ||
      !investigation
    ) {
      return;
    }

    try {
      setChatLoading(true);
      setChatError("");

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

      setMessageInput("");


      /*
       * Refresh the chat history after
       * every successful message.
       *
       * This is safer than assuming the
       * exact POST response structure.
       */
      const chatResponse =
        await getInvestigationMessages(
          investigation.investigationId
        );

      if (chatResponse.success) {
        setMessages(
          Array.isArray(chatResponse.data)
            ? chatResponse.data
            : chatResponse.data?.messages || []
        );
      }

    } catch (err) {
      console.error(
        "Send chat message error:",
        err
      );

      setChatError(
        err.response?.data?.error?.message ||
          err.message ||
          "Unable to send message."
      );
    } finally {
      setChatLoading(false);
    }
  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <PageTransition>

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="flex items-center gap-3 text-slate-400">

            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />

            <span className="text-sm">
              Loading investigation...
            </span>

          </div>

        </div>

      </PageTransition>
    );
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !investigation) {
    return (
      <PageTransition>

        <div className="flex min-h-[70vh] items-center justify-center">

          <Card className="border-red-500/20 bg-red-500/5">

            <CardContent className="p-8 text-center">

              <CircleAlert className="mx-auto mb-4 h-8 w-8 text-red-400" />

              <h2 className="text-lg font-medium text-white">
                Investigation unavailable
              </h2>

              <p className="mt-2 text-sm text-red-300">
                {error ||
                  "Investigation was not found."}
              </p>

              <Button
                variant="outline"
                className="mt-5 border-white/[0.08]"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>

            </CardContent>

          </Card>

        </div>

      </PageTransition>
    );
  }


  /* =======================================================
     DATA NORMALIZATION
  ======================================================= */

  const snapshot =
    investigation.evidenceSnapshot || {};

  const gateway =
    snapshot.gateway?.records?.[0];

  const bank =
    snapshot.bank?.records?.[0];

  const ledger =
    snapshot.ledger?.records?.[0];

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

  const evidenceScore =
    investigation.evidenceScore || 0;


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <PageTransition>

      <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-5">

          <Button
            variant="ghost"
            className="w-fit px-0 text-slate-500 hover:bg-transparent hover:text-white"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>


          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <span className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-400">
                  Investigation
                </span>

                <span className="text-slate-700">
                  /
                </span>

                <span className="font-mono text-xs text-slate-500">
                  {investigation.investigationId}
                </span>

              </div>

              <h1 className="font-mono text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {investigation.transactionId}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Payment transaction investigation and reconciliation
              </p>

            </div>


            <div className="flex flex-wrap items-center gap-3">

              <StatusBadge
                status={investigation.status}
              />

              <SeverityBadge
                severity={investigation.severity}
              />

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* OVERVIEW */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card className="border-white/[0.07] bg-white/[0.025]">
            <CardContent className="p-5">

              <p className="text-xs text-slate-500">
                Transaction
              </p>

              <p className="mt-2 font-mono text-sm text-white">
                {investigation.transactionId}
              </p>

            </CardContent>
          </Card>


          <Card className="border-white/[0.07] bg-white/[0.025]">
            <CardContent className="p-5">

              <p className="text-xs text-slate-500">
                Evidence Score
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {evidenceScore}
                <span className="text-sm text-slate-500">
                  /100
                </span>
              </p>

            </CardContent>
          </Card>


          <Card className="border-white/[0.07] bg-white/[0.025]">
            <CardContent className="p-5">

              <p className="text-xs text-slate-500">
                Finding
              </p>

              <p className="mt-2 text-sm font-medium text-orange-400">
                {(investigation.overallFinding ||
                  "UNKNOWN"
                ).replaceAll("_", " ")}
              </p>

            </CardContent>
          </Card>


          <Card className="border-white/[0.07] bg-white/[0.025]">
            <CardContent className="p-5">

              <p className="text-xs text-slate-500">
                Status
              </p>

              <p className="mt-2 text-sm font-medium text-emerald-400">
                {investigation.status?.replaceAll(
                  "_",
                  " "
                )}
              </p>

            </CardContent>
          </Card>

        </div>


        {/* ================================================= */}
        {/* PIPELINE */}
        {/* ================================================= */}

        <Card className="border-white/[0.07] bg-white/[0.025] backdrop-blur-xl">

          <CardHeader>

            <div className="flex items-center justify-between">

              <div>

                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <GitCompare className="h-4 w-4 text-cyan-400" />
                  Transaction Pipeline
                </CardTitle>

                <p className="mt-1 text-xs text-slate-500">
                  Cross-system evidence trace
                </p>

              </div>

              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">

                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                Live evidence

              </div>

            </div>

          </CardHeader>


          <CardContent>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

              <SystemNode
                name="Payment Gateway"
                system="gateway"
                exists={
                  snapshot.gateway?.exists
                }
                status={gateway?.status}
                amount={gateway?.amount}
              />

              <PipelineConnector active />

              <SystemNode
                name="Bank"
                system="bank"
                exists={
                  snapshot.bank?.exists
                }
                status={bank?.status}
                amount={bank?.amount}
              />

              <PipelineConnector active />

              <SystemNode
                name="Ledger"
                system="ledger"
                exists={
                  snapshot.ledger?.exists
                }
                status={ledger?.status}
                amount={ledger?.amount}
              />

            </div>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* RECONCILIATION + SCORE */}
        {/* ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">


          {/* Reconciliation */}

          <Card className="border-white/[0.07] bg-white/[0.025]">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-base text-white">
                <ShieldAlert className="h-4 w-4 text-orange-400" />
                Reconciliation
              </CardTitle>

            </CardHeader>


            <CardContent>

              <div className="rounded-2xl border border-orange-500/10 bg-orange-500/[0.03] p-5">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                  <div>

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Overall finding
                    </p>

                    <p className="mt-2 text-xl font-semibold text-orange-400">
                      {(
                        reconciliation.overallFinding ||
                        investigation.overallFinding ||
                        "UNKNOWN"
                      ).replaceAll("_", " ")}
                    </p>

                  </div>

                  <SeverityBadge
                    severity={
                      reconciliation.severity ||
                      investigation.severity
                    }
                  />

                </div>


                <div className="mt-5 grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-white/[0.05] bg-black/10 p-4">

                    <p className="text-[11px] text-slate-500">
                      Gateway
                    </p>

                    <p className="mt-1 text-sm font-medium text-emerald-400">
                      {reconciliation.summary?.gatewayExists
                        ? "Present"
                        : "Missing"}
                    </p>

                  </div>


                  <div className="rounded-xl border border-white/[0.05] bg-black/10 p-4">

                    <p className="text-[11px] text-slate-500">
                      Bank
                    </p>

                    <p className="mt-1 text-sm font-medium text-emerald-400">
                      {reconciliation.summary?.bankExists
                        ? "Present"
                        : "Missing"}
                    </p>

                  </div>


                  <div className="rounded-xl border border-white/[0.05] bg-black/10 p-4">

                    <p className="text-[11px] text-slate-500">
                      Ledger
                    </p>

                    <p
                      className={`mt-1 text-sm font-medium ${
                        reconciliation.summary?.ledgerExists
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {reconciliation.summary?.ledgerExists
                        ? "Present"
                        : "Missing"}
                    </p>

                  </div>

                </div>

              </div>


              {reconciliation.findings?.length >
                0 && (
                <div className="mt-4 space-y-2">

                  {reconciliation.findings.map(
                    (finding, index) => (
                      <div
                        key={`${finding.code}-${index}`}
                        className="flex gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
                      >

                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="font-mono text-xs text-orange-300">
                              {finding.code}
                            </span>

                            <SeverityBadge
                              severity={
                                finding.severity
                              }
                            />

                          </div>

                          <p className="mt-1 text-sm text-slate-400">
                            {finding.message}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </CardContent>

          </Card>


          {/* Evidence score */}

          <Card className="border-white/[0.07] bg-white/[0.025]">

            <CardHeader>

              <CardTitle className="text-base text-white">
                Evidence Confidence
              </CardTitle>

            </CardHeader>


            <CardContent>

              <div className="flex flex-col items-center">

                <ScoreRing
                  score={evidenceScore}
                />

                <p className="mt-4 max-w-xs text-center text-sm text-slate-400">
                  Confidence based on the availability and consistency of transaction evidence.
                </p>


                <div className="mt-5 grid w-full grid-cols-3 gap-2 text-center">

                  <div>
                    <p className="text-lg font-semibold text-emerald-400">
                      {snapshot.gateway?.exists
                        ? "✓"
                        : "×"}
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Gateway
                    </p>
                  </div>


                  <div>
                    <p className="text-lg font-semibold text-emerald-400">
                      {snapshot.bank?.exists
                        ? "✓"
                        : "×"}
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Bank
                    </p>
                  </div>


                  <div>
                    <p
                      className={`text-lg font-semibold ${
                        snapshot.ledger?.exists
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {snapshot.ledger?.exists
                        ? "✓"
                        : "×"}
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Ledger
                    </p>
                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* ================================================= */}
        {/* AI ANALYSIS */}
        {/* ================================================= */}

        <div className="grid gap-6 lg:grid-cols-2">


          {/* Root Cause */}

          <Card className="border-cyan-500/10 bg-cyan-500/[0.02]">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Bot className="h-4 w-4 text-cyan-400" />
                AI Root Cause
              </CardTitle>

            </CardHeader>


            <CardContent>

              <div className="rounded-xl border border-cyan-500/10 bg-black/10 p-5">

                <p className="text-sm leading-6 text-slate-300">
                  {rootCause.rootCause ||
                    "No root cause analysis available."}
                </p>


                {rootCause.confidence !==
                  undefined && (
                  <div className="mt-5">

                    <div className="mb-2 flex justify-between text-xs">

                      <span className="text-slate-500">
                        AI confidence
                      </span>

                      <span className="text-cyan-400">
                        {rootCause.confidence}%
                      </span>

                    </div>


                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${rootCause.confidence}%`,
                        }}
                        transition={{
                          duration: 0.8,
                        }}
                        className="h-full rounded-full bg-cyan-400"
                      />

                    </div>

                  </div>
                )}

              </div>


              {rootCause.supportingEvidence
                ?.length > 0 && (
                <div className="mt-4">

                  <p className="mb-3 text-xs uppercase tracking-wider text-slate-600">
                    Supporting evidence
                  </p>

                  <div className="space-y-2">

                    {rootCause.supportingEvidence.map(
                      (evidence, index) => (
                        <div
                          key={index}
                          className="flex gap-3 text-xs leading-5 text-slate-400"
                        >

                          <span className="font-mono text-cyan-500">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                          <span>
                            {evidence}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </CardContent>

          </Card>


          {/* Resolution */}

          <Card className="border-emerald-500/10 bg-emerald-500/[0.02]">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Zap className="h-4 w-4 text-emerald-400" />
                Recommended Action
              </CardTitle>

            </CardHeader>


            <CardContent>

              <div className="rounded-xl border border-emerald-500/10 bg-black/10 p-5">

                <p className="text-sm leading-6 text-slate-300">
                  {resolution.recommendedAction ||
                    "No recommended action available."}
                </p>


                {resolution.priority && (
                  <div className="mt-4">

                    <SeverityBadge
                      severity={
                        resolution.priority
                      }
                    />

                  </div>
                )}

              </div>


              {resolution.steps?.length > 0 && (
                <div className="mt-4 space-y-3">

                  {resolution.steps.map(
                    (step, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >

                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400">
                          {index + 1}
                        </div>

                        <p className="text-xs leading-5 text-slate-400">
                          {step}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}

            </CardContent>

          </Card>

        </div>


        {/* ================================================= */}
        {/* EVIDENCE DETAILS */}
        {/* ================================================= */}

        <Card className="border-white/[0.07] bg-white/[0.025]">

          <CardHeader>

            <CardTitle className="text-base text-white">
              Evidence Details
            </CardTitle>

            <p className="text-xs text-slate-500">
              Raw evidence collected from connected systems
            </p>

          </CardHeader>


          <CardContent className="p-0">

            <EvidenceRow
              title="Gateway Record"
              exists={
                snapshot.gateway?.exists
              }
              value={gateway}
            />

            <EvidenceRow
              title="Bank Record"
              exists={
                snapshot.bank?.exists
              }
              value={bank}
            />

            <EvidenceRow
              title="Ledger Record"
              exists={
                snapshot.ledger?.exists
              }
              value={ledger}
            />

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* SUPPORT SUMMARY */}
        {/* ================================================= */}

        {support.summary && (
          <Card className="border-white/[0.07] bg-white/[0.025]">

            <CardHeader>

              <CardTitle className="text-base text-white">
                Support Summary
              </CardTitle>

            </CardHeader>


            <CardContent>

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">

                <p className="text-sm leading-6 text-slate-300">
                  {support.summary}
                </p>


                {resolution.escalationRequired && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">

                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />

                    <div>

                      <p className="text-xs font-medium text-orange-300">
                        Escalation required
                      </p>

                      {resolution.escalationReason && (
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {resolution.escalationReason}
                        </p>
                      )}

                    </div>

                  </div>
                )}

              </div>

            </CardContent>

          </Card>
        )}


        {/* ================================================= */}
        {/* ASK LEDGERLENS */}
        {/* ================================================= */}

        <Card className="overflow-hidden border-cyan-500/10 bg-cyan-500/[0.02]">

          <CardHeader className="border-b border-white/[0.05]">

            <div className="flex items-center justify-between">

              <div>

                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                  Ask LedgerLens
                </CardTitle>

                <p className="mt-1 text-xs text-slate-600">
                  Ask follow-up questions about this investigation
                </p>

              </div>


              <div className="flex items-center gap-2">

                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                <span className="text-[10px] uppercase tracking-wider text-cyan-400">
                  AI Ready
                </span>

              </div>

            </div>

          </CardHeader>


          <CardContent className="p-0">


            {/* Chat messages */}

            <div className="max-h-[420px] min-h-[220px] space-y-4 overflow-y-auto p-5">

              {messages.length === 0 && (
                <div className="flex min-h-[180px] flex-col items-center justify-center text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.05]">

                    <Bot className="h-5 w-5 text-cyan-400" />

                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    Ask LedgerLens about this transaction.
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-600">
                    Try asking why the transaction is pending,
                    what caused the reconciliation issue, or what
                    the support team should do next.
                  </p>

                </div>
              )}


              {messages.map(
                (message, index) => {

                  const isUser =
                    message.role === "USER" ||
                    message.role === "user";

                  return (
                    <motion.div
                      key={
                        message._id ||
                        message.id ||
                        index
                      }
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className={`flex gap-3 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/10 bg-cyan-500/[0.06]">

                          <Bot className="h-4 w-4 text-cyan-400" />

                        </div>
                      )}


                      <div
                        className={`max-w-[80%] rounded-2xl border px-4 py-3 ${
                          isUser
                            ? "border-white/[0.08] bg-white/[0.04]"
                            : "border-cyan-500/10 bg-cyan-500/[0.03]"
                        }`}
                      >

                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                          {message.content}
                        </p>

                      </div>


                      {isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">

                          <UserRound className="h-4 w-4 text-slate-500" />

                        </div>
                      )}

                    </motion.div>
                  );
                }
              )}


              {/* AI thinking */}

              {chatLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/10 bg-cyan-500/[0.06]">

                    <Bot className="h-4 w-4 text-cyan-400" />

                  </div>


                  <div className="flex items-center gap-1 rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.03] px-4 py-3">

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />

                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
                      style={{
                        animationDelay:
                          "120ms",
                      }}
                    />

                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"
                      style={{
                        animationDelay:
                          "240ms",
                      }}
                    />

                  </div>

                </motion.div>
              )}

            </div>


            {/* Chat error */}

            {chatError && (
              <div className="mx-5 mb-3 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-xs text-red-400">
                {chatError}
              </div>
            )}


            {/* Suggested questions */}

            <div className="border-t border-white/[0.05] px-5 py-3">

              <div className="flex flex-wrap gap-2">

                {[
                  "Why is this transaction pending?",
                  "What caused the issue?",
                  "What should support do next?",
                ].map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={chatLoading}
                    onClick={() =>
                      setMessageInput(
                        question
                      )
                    }
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10px] text-slate-500 transition-colors hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] hover:text-cyan-400 disabled:opacity-40"
                  >
                    {question}
                  </button>
                ))}

              </div>

            </div>


            {/* Input */}

            <form
              onSubmit={handleSendMessage}
              className="border-t border-white/[0.05] p-4"
            >

              <div className="flex gap-3">

                <Input
                  value={messageInput}
                  onChange={(event) =>
                    setMessageInput(
                      event.target.value
                    )
                  }
                  placeholder="Ask about this investigation..."
                  disabled={chatLoading}
                  className="h-11 border-white/[0.07] bg-black/20 text-sm text-white placeholder:text-slate-700 focus-visible:ring-cyan-500/30"
                />

                <Button
                  type="submit"
                  disabled={
                    chatLoading ||
                    !messageInput.trim()
                  }
                  className="h-11 w-11 shrink-0 bg-cyan-500 p-0 text-black hover:bg-cyan-400"
                >

                  {chatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}

                </Button>

              </div>

            </form>

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between border-t border-white/[0.05] pt-5 text-[11px] text-slate-600">

          <span>
            Investigation ID:{" "}
            {investigation.investigationId}
          </span>

          <span>
            LedgerLens Investigation Engine
          </span>

        </div>

      </div>

    </PageTransition>
  );
}