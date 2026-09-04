import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PageTransition from "@/components/layout/PageTransition";

import { createInvestigation } from "@/services/investigation.api";


export default function Investigate() {
  const navigate = useNavigate();

  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleInvestigate(event) {
    event.preventDefault();

    const id = transactionId.trim();

    if (!id) {
      setError("Enter a transaction ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createInvestigation(id);

      if (!response.success) {
        throw new Error(
          response.error?.message ||
            "Unable to start investigation."
        );
      }

      /*
       * Backend should return the created investigation.
       * We navigate using the public investigationId.
       */
      const investigation =
        response.data?.investigation ||
        response.data;

      const investigationId =
        investigation?.investigationId;

      if (!investigationId) {
        throw new Error(
          "Investigation was created but no investigation ID was returned."
        );
      }

      navigate(
        `/investigations/${investigationId}`
      );

    } catch (err) {
      console.error(
        "Investigation creation error:",
        err
      );

      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Unable to start investigation."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center p-6">

        <div className="w-full max-w-3xl">

          {/* Header */}
          <div className="mb-8 text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10"
            >
              <Sparkles className="h-6 w-6 text-cyan-400" />
            </motion.div>

            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Investigate a Transaction
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Trace a payment across the gateway, bank, and ledger
              systems. LedgerLens will reconcile the evidence and
              identify the likely root cause.
            </p>

          </div>


          {/* Search Card */}
          <Card className="border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20">

            <CardContent className="p-6 md:p-8">

              <form
                onSubmit={handleInvestigate}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                    Transaction ID
                  </label>

                  <div className="relative">

                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                    <Input
                      value={transactionId}
                      onChange={(event) =>
                        setTransactionId(
                          event.target.value
                        )
                      }
                      placeholder="e.g. TXN-82941"
                      disabled={loading}
                      className="h-14 border-white/[0.08] bg-black/20 pl-11 font-mono text-base text-white placeholder:text-slate-700 focus-visible:ring-cyan-500/30"
                    />

                  </div>
                </div>


                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}


                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full bg-cyan-500 text-sm font-medium text-black hover:bg-cyan-400"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Investigating transaction...
                    </>
                  ) : (
                    <>
                      Investigate Transaction
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

              </form>


              {/* Demo transaction */}
              <div className="mt-6 border-t border-white/[0.05] pt-5">

                <p className="mb-3 text-[10px] uppercase tracking-wider text-slate-600">
                  Demo transaction
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setTransactionId("TXN-82941")
                  }
                  className="group flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-cyan-500/20 hover:bg-cyan-500/[0.03]"
                >
                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                      <ShieldCheck className="h-4 w-4 text-orange-400" />
                    </div>

                    <div>
                      <p className="font-mono text-sm text-slate-300">
                        TXN-82941
                      </p>

                      <p className="text-[10px] text-slate-600">
                        Known reconciliation exception
                      </p>
                    </div>

                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-700 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                </button>

              </div>

            </CardContent>
          </Card>


          {/* Investigation pipeline */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">

            {[
              {
                title: "Collect",
                description: "Gateway, bank & ledger evidence",
              },
              {
                title: "Reconcile",
                description: "Detect inconsistencies",
              },
              {
                title: "Explain",
                description: "AI-powered root cause",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15 + index * 0.08,
                }}
                className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4"
              >
                <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                </div>

                <p className="text-sm font-medium text-slate-300">
                  {item.title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-600">
                  {item.description}
                </p>
              </motion.div>
            ))}

          </div>

        </div>

      </div>
    </PageTransition>
  );
}