import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  FileSearch,
  Search,
  ShieldAlert,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import PageTransition from "@/components/layout/PageTransition";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

import { getDashboardSummary } from "@/services/dashboard.api";
import { getInvestigations } from "@/services/investigation.api";


function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
      }}
    >
      <Card className="group relative overflow-hidden border-white/[0.07] bg-white/[0.025] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.035]">
        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.05]" />

        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {title}
              </p>

              <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
                <AnimatedNumber value={value || 0} />
              </div>

              <p className="mt-2 text-xs text-slate-600">
                {subtitle}
              </p>
            </div>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.05] ${iconClass}`}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


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
      className={`text-[10px] tracking-wider ${
        styles[severity] || styles.MEDIUM
      }`}
    >
      {severity || "UNKNOWN"}
    </Badge>
  );
}


function FindingBadge({ finding }) {
  const labels = {
    SUCCESS: "SUCCESS",
    SETTLEMENT_DELAYED: "SETTLEMENT DELAYED",
    SETTLEMENT_FAILED: "SETTLEMENT FAILED",
    AMOUNT_MISMATCH: "AMOUNT MISMATCH",
    MISSING_EVIDENCE: "MISSING EVIDENCE",
    INCONSISTENT: "INCONSISTENT",
    UNKNOWN: "UNKNOWN",
  };

  return (
    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
      {labels[finding] || finding || "UNKNOWN"}
    </span>
  );
}


function SystemStatus({
  name,
  status,
  icon: Icon,
}) {
  const operational = status === "Operational";

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm text-slate-300">
            {name}
          </p>

          <p className="text-[10px] text-slate-600">
            External system
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            operational
              ? "animate-pulse bg-emerald-400"
              : "bg-red-400"
          }`}
        />

        <span
          className={`text-xs ${
            operational
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}


function BreakdownItem({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${iconClass}`} />

        <span className="text-sm text-slate-400">
          {label}
        </span>
      </div>

      <span className="font-mono text-sm text-white">
        {value || 0}
      </span>
    </div>
  );
}


function formatTime(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}


export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [investigations, setInvestigations] =
    useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          summaryResponse,
          investigationsResponse,
        ] = await Promise.all([
          getDashboardSummary(),
          getInvestigations(),
        ]);

        if (!summaryResponse.success) {
          throw new Error(
            summaryResponse.error?.message ||
              "Failed to load dashboard data."
          );
        }

        if (!investigationsResponse.success) {
          throw new Error(
            investigationsResponse.error?.message ||
              "Failed to load investigations."
          );
        }

        setSummary(summaryResponse.data);

        setInvestigations(
          Array.isArray(investigationsResponse.data)
            ? investigationsResponse.data
            : []
        );
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.error?.message ||
            err.message ||
            "Unable to connect to backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);


  const filteredInvestigations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return investigations;
    }

    return investigations.filter((item) => {
      return (
        item.transactionId
          ?.toLowerCase()
          .includes(query) ||
        item.investigationId
          ?.toLowerCase()
          .includes(query) ||
        item.severity
          ?.toLowerCase()
          .includes(query) ||
        item.overallFinding
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [investigations, search]);


  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

            <span className="text-sm">
              Loading LedgerLens control center...
            </span>
          </div>
        </div>
      </PageTransition>
    );
  }


  if (error) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <Card className="max-w-md border-red-500/20 bg-red-500/[0.03]">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-red-400" />

              <h2 className="mt-4 text-lg font-medium text-white">
                Dashboard unavailable
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {error}
              </p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }


  const data = summary || {};

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-400">
                Systems operational
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Investigation Control Center
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Monitor payment investigations, reconciliation anomalies,
              and settlement exceptions across connected systems.
            </p>
          </div>


          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search transaction..."
              className="h-10 border-white/[0.08] bg-white/[0.025] pl-10 text-sm text-white placeholder:text-slate-600 focus-visible:ring-cyan-500/30"
            />

            <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-slate-600 sm:block">
              /
            </div>
          </div>

        </div>


        {/* ================================================= */}
        {/* STAT CARDS */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Investigations"
            value={data.totalInvestigations}
            subtitle="All recorded investigations"
            icon={FileSearch}
            iconClass="text-cyan-400 bg-cyan-400/10"
            delay={0}
          />

          <StatCard
            title="Completed"
            value={data.completedInvestigations}
            subtitle="Successfully processed"
            icon={CheckCircle2}
            iconClass="text-emerald-400 bg-emerald-400/10"
            delay={0.05}
          />

          <StatCard
            title="High Severity"
            value={data.highSeverity}
            subtitle="Requires attention"
            icon={ShieldAlert}
            iconClass="text-orange-400 bg-orange-400/10"
            delay={0.1}
          />

          <StatCard
            title="Missing Evidence"
            value={data.missingEvidence}
            subtitle="Incomplete system trail"
            icon={Database}
            iconClass="text-red-400 bg-red-400/10"
            delay={0.15}
          />

        </div>


        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">


          {/* ================================================= */}
          {/* RECENT INVESTIGATIONS */}
          {/* ================================================= */}

          <Card className="border-white/[0.07] bg-white/[0.025]">

            <CardHeader>
              <div className="flex items-center justify-between">

                <div>
                  <CardTitle className="text-base text-white">
                    Recent Investigations
                  </CardTitle>

                  <p className="mt-1 text-xs text-slate-600">
                    Latest payment investigations
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-600">
                  <Activity className="h-3.5 w-3.5" />

                  {filteredInvestigations.length} results
                </div>

              </div>
            </CardHeader>


            <CardContent className="p-0">

              {filteredInvestigations.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Search className="mx-auto h-6 w-6 text-slate-700" />

                  <p className="mt-3 text-sm text-slate-500">
                    No investigations found.
                  </p>
                </div>
              ) : (
                <div>
                  {filteredInvestigations.map(
                    (investigation, index) => (
                      <motion.button
                        key={investigation._id || investigation.investigationId}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.04,
                        }}
                        onClick={() =>
                          navigate(
                            `/investigations/${investigation.investigationId}`
                          )
                        }
                        className="group flex w-full items-center gap-4 border-t border-white/[0.05] px-5 py-4 text-left transition-colors hover:bg-white/[0.025]"
                      >

                        {/* Status indicator */}
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            investigation.severity ===
                            "CRITICAL"
                              ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]"
                              : investigation.severity ===
                                "HIGH"
                              ? "bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                              : "bg-emerald-400"
                          }`}
                        />


                        {/* Transaction */}
                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm font-medium text-white">
                              {investigation.transactionId}
                            </span>

                            <SeverityBadge
                              severity={
                                investigation.severity
                              }
                            />
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <FindingBadge
                              finding={
                                investigation.overallFinding
                              }
                            />

                            <span className="text-slate-700">
                              •
                            </span>

                            <span className="text-[10px] text-slate-600">
                              {formatTime(
                                investigation.createdAt
                              )}
                            </span>
                          </div>

                        </div>


                        {/* Evidence score */}
                        <div className="hidden text-right sm:block">
                          <p className="font-mono text-sm text-slate-300">
                            {investigation.evidenceScore ||
                              0}
                          </p>

                          <p className="text-[9px] uppercase tracking-wider text-slate-700">
                            Evidence
                          </p>
                        </div>


                        <ArrowRight className="h-4 w-4 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-cyan-400" />

                      </motion.button>
                    )
                  )}
                </div>
              )}

            </CardContent>
          </Card>


          {/* ================================================= */}
          {/* SYSTEM STATUS */}
          {/* ================================================= */}

          <Card className="border-white/[0.07] bg-white/[0.025]">

            <CardHeader>
              <div className="flex items-center justify-between">

                <div>
                  <CardTitle className="text-base text-white">
                    Connected Systems
                  </CardTitle>

                  <p className="mt-1 text-xs text-slate-600">
                    Transaction evidence sources
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                  <span className="text-[10px] text-emerald-400">
                    LIVE
                  </span>
                </div>

              </div>
            </CardHeader>


            <CardContent className="space-y-3">

              <SystemStatus
                name="Payment Gateway"
                status="Operational"
                icon={Zap}
              />

              <SystemStatus
                name="Bank Settlement"
                status="Operational"
                icon={Database}
              />

              <SystemStatus
                name="Internal Ledger"
                status="Operational"
                icon={TrendingUp}
              />


              {/* AI Engine */}
              <div className="mt-5 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.03] p-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                    <Bot className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      AI Investigation Engine
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Root cause + resolution analysis
                    </p>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                    <span className="text-[10px] text-cyan-400">
                      READY
                    </span>
                  </div>
                </div>

              </div>

            </CardContent>
          </Card>

        </div>


        {/* ================================================= */}
        {/* LOWER GRID */}
        {/* ================================================= */}

        <div className="grid gap-6 lg:grid-cols-2">


          {/* ================================================= */}
          {/* INVESTIGATION BREAKDOWN */}
          {/* ================================================= */}

          <Card className="border-white/[0.07] bg-white/[0.025]">

            <CardHeader>
              <CardTitle className="text-base text-white">
                Investigation Breakdown
              </CardTitle>

              <p className="text-xs text-slate-600">
                Findings detected by reconciliation engine
              </p>
            </CardHeader>

            <CardContent className="divide-y divide-white/[0.05]">

              <BreakdownItem
                label="Successful"
                value={
                  data.totalInvestigations -
                  (data.highSeverity || 0)
                }
                icon={CheckCircle2}
                iconClass="text-emerald-400"
              />

              <BreakdownItem
                label="Settlement delayed"
                value={data.settlementDelayed}
                icon={Clock3}
                iconClass="text-yellow-400"
              />

              <BreakdownItem
                label="Settlement failed"
                value={data.settlementFailed}
                icon={XCircle}
                iconClass="text-red-400"
              />

              <BreakdownItem
                label="Amount mismatch"
                value={data.amountMismatch}
                icon={AlertTriangle}
                iconClass="text-orange-400"
              />

              <BreakdownItem
                label="Inconsistent"
                value={data.inconsistent}
                icon={ShieldAlert}
                iconClass="text-red-400"
              />

            </CardContent>
          </Card>


          {/* ================================================= */}
          {/* INVESTIGATION ENGINE */}
          {/* ================================================= */}

          <Card className="relative overflow-hidden border-cyan-500/10 bg-cyan-500/[0.02]">

            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/[0.03] blur-3xl" />

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Bot className="h-4 w-4 text-cyan-400" />
                Investigation Engine
              </CardTitle>

              <p className="text-xs text-slate-600">
                Automated transaction reasoning pipeline
              </p>
            </CardHeader>

            <CardContent>

              <div className="relative space-y-5">

                <div className="absolute bottom-3 left-[11px] top-3 w-px bg-white/[0.06]" />


                <div className="relative flex gap-4">
                  <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                    <Search className="h-3 w-3 text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-300">
                      Evidence collection
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Gateway, bank and ledger records
                    </p>
                  </div>
                </div>


                <div className="relative flex gap-4">
                  <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
                    <GitCompareIcon />
                  </div>

                  <div>
                    <p className="text-sm text-slate-300">
                      Reconciliation
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Amount, status, timeline and missing evidence
                    </p>
                  </div>
                </div>


                <div className="relative flex gap-4">
                  <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                    <Bot className="h-3 w-3 text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-300">
                      AI root cause analysis
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Evidence-backed explanation and resolution
                    </p>
                  </div>
                </div>

              </div>

            </CardContent>
          </Card>

        </div>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-2 border-t border-white/[0.05] pt-5 text-[10px] text-slate-700 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3" />

            LedgerLens monitoring active
          </div>

          <span>
            Automated reconciliation • AI-assisted investigation
          </span>

        </div>

      </div>
    </PageTransition>
  );
}


function GitCompareIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-purple-400"
    >
      <path d="M12 3v18" />
      <path d="M6 7h12" />
      <path d="M6 17h12" />
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  );
}