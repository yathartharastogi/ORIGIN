import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  Filter,
  Loader2,
  Search,
  ShieldAlert,
  XCircle,
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
import { Button } from "@/components/ui/button";

import PageTransition from "@/components/layout/PageTransition";

import { getInvestigations } from "@/services/investigation.api";


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


function StatusBadge({ status }) {
  const completed = status === "COMPLETED";

  return (
    <div className="flex items-center gap-2">
      {completed ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Clock3 className="h-3.5 w-3.5 text-yellow-400" />
      )}

      <span
        className={`text-xs ${
          completed
            ? "text-emerald-400"
            : "text-yellow-400"
        }`}
      >
        {status?.replaceAll("_", " ") || "UNKNOWN"}
      </span>
    </div>
  );
}


function FindingIcon({ finding }) {
  if (finding === "SUCCESS") {
    return (
      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    );
  }

  if (finding === "SETTLEMENT_DELAYED") {
    return (
      <Clock3 className="h-4 w-4 text-yellow-400" />
    );
  }

  if (finding === "SETTLEMENT_FAILED") {
    return (
      <XCircle className="h-4 w-4 text-red-400" />
    );
  }

  if (finding === "AMOUNT_MISMATCH") {
    return (
      <AlertTriangle className="h-4 w-4 text-orange-400" />
    );
  }

  return (
    <ShieldAlert className="h-4 w-4 text-orange-400" />
  );
}


function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export default function Investigations() {
  const navigate = useNavigate();

  const [investigations, setInvestigations] =
    useState([]);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadInvestigations() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getInvestigations();

        if (!response.success) {
          throw new Error(
            response.error?.message ||
              "Failed to load investigations."
          );
        }

        setInvestigations(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (err) {
        console.error(
          "Investigation log error:",
          err
        );

        setError(
          err.response?.data?.error?.message ||
            err.message ||
            "Unable to load investigations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvestigations();
  }, []);


  const filteredInvestigations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return investigations.filter((item) => {
      const matchesSearch =
        !query ||
        item.transactionId
          ?.toLowerCase()
          .includes(query) ||
        item.investigationId
          ?.toLowerCase()
          .includes(query) ||
        item.overallFinding
          ?.toLowerCase()
          .includes(query);

      const matchesSeverity =
        severityFilter === "ALL" ||
        item.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [
    investigations,
    search,
    severityFilter,
  ]);


  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />

            <span className="text-sm">
              Loading investigation log...
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
                Investigation log unavailable
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {error}
              </p>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-5 border-white/[0.08]"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }


  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>
            <div className="mb-3 flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-cyan-400" />

              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                Investigation Log
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Investigation History
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review previously processed payment investigations
              and reconciliation findings.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Total investigations
            </p>

            <p className="mt-1 font-mono text-xl text-white">
              {investigations.length}
            </p>
          </div>

        </div>


        {/* Filters */}
        <Card className="border-white/[0.07] bg-white/[0.025]">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search transaction or investigation ID..."
                className="h-10 border-white/[0.07] bg-black/10 pl-10 text-sm text-white placeholder:text-slate-600"
              />
            </div>


            <div className="flex items-center gap-2 overflow-x-auto">

              <Filter className="h-4 w-4 shrink-0 text-slate-600" />

              {[
                "ALL",
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL",
              ].map((severity) => (
                <Button
                  key={severity}
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSeverityFilter(severity)
                  }
                  className={`h-9 shrink-0 text-[10px] ${
                    severityFilter === severity
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-600 hover:bg-white/[0.04] hover:text-slate-300"
                  }`}
                >
                  {severity}
                </Button>
              ))}

            </div>

          </CardContent>
        </Card>


        {/* Table */}
        <Card className="overflow-hidden border-white/[0.07] bg-white/[0.025]">

          <CardHeader className="border-b border-white/[0.05]">
            <div className="flex items-center justify-between">

              <div>
                <CardTitle className="text-base text-white">
                  All Investigations
                </CardTitle>

                <p className="mt-1 text-xs text-slate-600">
                  {filteredInvestigations.length} matching records
                </p>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-[10px] text-emerald-400">
                  DATA CONNECTED
                </span>
              </div>

            </div>
          </CardHeader>


          <CardContent className="p-0">

            {filteredInvestigations.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto h-7 w-7 text-slate-700" />

                <p className="mt-4 text-sm text-slate-500">
                  No investigations match your filters.
                </p>
              </div>
            ) : (

              <div>

                {/* Desktop header */}
                <div className="hidden grid-cols-[1.3fr_1fr_0.8fr_0.9fr_0.8fr_32px] gap-4 border-b border-white/[0.05] px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-slate-700 md:grid">

                  <span>Transaction</span>
                  <span>Finding</span>
                  <span>Severity</span>
                  <span>Status</span>
                  <span>Evidence</span>
                  <span />

                </div>


                {filteredInvestigations.map(
                  (investigation, index) => (

                    <motion.button
                      key={
                        investigation._id ||
                        investigation.investigationId
                      }
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
                      className="group grid w-full grid-cols-1 gap-4 border-b border-white/[0.05] px-5 py-5 text-left transition-colors hover:bg-white/[0.025] md:grid-cols-[1.3fr_1fr_0.8fr_0.9fr_0.8fr_32px] md:items-center"
                    >

                      {/* Transaction */}
                      <div className="min-w-0">

                        <div className="flex items-center gap-2">
                          <FindingIcon
                            finding={
                              investigation.overallFinding
                            }
                          />

                          <span className="truncate font-mono text-sm font-medium text-white">
                            {investigation.transactionId}
                          </span>
                        </div>

                        <p className="mt-1 truncate pl-6 font-mono text-[9px] text-slate-700">
                          {investigation.investigationId}
                        </p>

                        <p className="mt-1 pl-6 text-[10px] text-slate-600 md:hidden">
                          {formatDate(
                            investigation.createdAt
                          )}
                        </p>

                      </div>


                      {/* Finding */}
                      <div>
                        <FindingBadge
                          finding={
                            investigation.overallFinding
                          }
                        />
                      </div>


                      {/* Severity */}
                      <div>
                        <SeverityBadge
                          severity={
                            investigation.severity
                          }
                        />
                      </div>


                      {/* Status */}
                      <StatusBadge
                        status={
                          investigation.status
                        }
                      />


                      {/* Evidence */}
                      <div>
                        <div className="flex items-center gap-2">

                          <span className="font-mono text-sm text-slate-300">
                            {investigation.evidenceScore ||
                              0}
                          </span>

                          <span className="text-[9px] text-slate-700">
                            /100
                          </span>

                        </div>

                        <div className="mt-2 h-1 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{
                              width: `${Math.min(
                                investigation.evidenceScore ||
                                  0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>


                      {/* Arrow */}
                      <ArrowRight className="hidden h-4 w-4 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-cyan-400 md:block" />

                    </motion.button>
                  )
                )}

              </div>
            )}

          </CardContent>
        </Card>


        {/* Footer info */}
        <div className="flex items-center gap-2 text-[10px] text-slate-700">
          <ShieldCheckIcon />

          Investigation records are generated by the LedgerLens
          reconciliation engine.
        </div>

      </div>
    </PageTransition>
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


function ShieldCheckIcon() {
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
      className="text-slate-700"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}