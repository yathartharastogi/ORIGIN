import { motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Database,
  GitCompareArrows,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const systems = [
  {
    name: "Gateway",
    status: "SUCCESS",
    icon: CheckCircle2,
    tone: "text-emerald-400",
  },
  {
    name: "Bank",
    status: "PENDING",
    icon: CircleAlert,
    tone: "text-amber-400",
  },
  {
    name: "Ledger",
    status: "MISSING",
    icon: Database,
    tone: "text-red-400",
  },
];

const features = [
  {
    icon: Search,
    title: "Trace",
    description:
      "Collect transaction evidence across gateway, bank and ledger systems.",
  },
  {
    icon: GitCompareArrows,
    title: "Reconcile",
    description:
      "Detect missing records, amount mismatches, status conflicts and settlement delays.",
  },
  {
    icon: Bot,
    title: "Explain",
    description:
      "Turn complex payment evidence into a clear root cause and recommended action.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <motion.div
          animate={{
            opacity: [0.12, 0.2, 0.12],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-[-250px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
        />

        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>

            <div className="text-left">
              <div className="text-[15px] font-semibold tracking-tight">
                LedgerLens
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Payment Intelligence
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#product"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Product
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </a>
            <a
              href="#ai"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              AI Engine
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden text-sm text-slate-300 transition hover:text-white sm:block"
            >
              Sign in
            </button>

            <button
              onClick={() => navigate("/login")}
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium transition hover:border-cyan-400/30 hover:bg-white/[0.09]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-xs text-cyan-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                AI-powered payment investigations
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Stop searching.
                <br />
                <span className="text-slate-500">Start investigating.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Trace payment transactions across Gateway, Bank and Ledger
                systems. Detect inconsistencies and understand the root cause
                in seconds.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
                >
                  Investigate a transaction
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                >
                  View demo
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Evidence driven
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Automated reconciliation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  AI explanations
                </div>
              </div>
            </motion.div>

            {/* Investigation visualization */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[40px] bg-cyan-400/[0.04] blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d12]/95 shadow-2xl shadow-black/40">
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-400/70" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                    </div>
                    <span className="ml-2 font-mono text-[10px] text-slate-500">
                      INVESTIGATION / TXN-82941
                    </span>
                  </div>

                  <span className="rounded-md border border-red-400/20 bg-red-400/10 px-2 py-1 text-[9px] font-semibold tracking-wider text-red-300">
                    HIGH SEVERITY
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="mb-7 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Transaction
                      </div>
                      <div className="mt-1 font-mono text-xl font-semibold">
                        TXN-82941
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Evidence
                      </div>
                      <div className="mt-1 text-xl font-semibold text-cyan-300">
                        67%
                      </div>
                    </div>
                  </div>

                  {/* Pipeline */}
                  <div className="space-y-0">
                    {systems.map((system, index) => {
                      const Icon = system.icon;

                      return (
                        <div key={system.name}>
                          <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.5 + index * 0.18,
                              duration: 0.45,
                            }}
                            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
                              <Icon className={`h-5 w-5 ${system.tone}`} />
                            </div>

                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {system.name}
                              </div>
                              <div className="mt-0.5 text-[10px] text-slate-500">
                                Source system
                              </div>
                            </div>

                            <div
                              className={`font-mono text-[10px] font-semibold ${system.tone}`}
                            >
                              {system.status}
                            </div>
                          </motion.div>

                          {index < systems.length - 1 && (
                            <div className="ml-9 h-5 border-l border-dashed border-white/10" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI result */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.15, duration: 0.5 }}
                    className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.035] p-4"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Root Cause
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Missing ledger record is causing a reconciliation
                      inconsistency and keeping the transaction in a pending
                      state.
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
                      <span className="text-[10px] text-slate-500">
                        Confidence
                      </span>
                      <span className="text-xs font-semibold text-cyan-300">
                        95%
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Product statement */}
        <section
          id="product"
          className="border-y border-white/[0.06] bg-white/[0.015]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Payment intelligence
              </div>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                One transaction.
                <br />
                <span className="text-slate-500">
                  Complete visibility.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                Stop jumping between payment systems, logs and spreadsheets.
                LedgerLens brings the evidence together and turns fragmented
                payment data into an investigation you can act on.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {systems.map((system, index) => {
                const Icon = system.icon;

                return (
                  <motion.div
                    key={system.name}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-white/[0.07] bg-[#090c10] p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                        <Icon className={`h-5 w-5 ${system.tone}`} />
                      </div>

                      <span className="font-mono text-[10px] text-slate-600">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-8 text-lg font-semibold">
                      {system.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Independent payment evidence collected and verified for
                      investigation.
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28"
        >
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              How it works
            </div>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              From transaction ID to root cause.
              <br />
              <span className="text-slate-500">Automatically.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-white/[0.07] bg-[#090c10] p-7 transition-colors hover:border-cyan-400/15"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06]">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div className="mt-7 flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-600">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg font-semibold">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* AI Section */}
        <section
          id="ai"
          className="border-y border-white/[0.06] bg-white/[0.015]"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                <Zap className="h-4 w-4" />
                AI investigation engine
              </div>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Code decides facts.
                <br />
                <span className="text-slate-500">AI explains facts.</span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                LedgerLens never asks AI to guess what happened. Structured
                evidence and deterministic reconciliation establish the facts.
                AI turns those facts into an explanation support teams can
                understand and act on.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="group mt-8 flex items-center gap-2 text-sm font-semibold text-white"
              >
                Explore the investigation engine
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/[0.08] bg-[#090c10] p-5 shadow-2xl shadow-black/30 sm:p-7"
            >
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10">
                  <Bot className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <div className="text-sm font-medium">
                    LedgerLens AI
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Analysis complete
                  </div>
                </div>
              </div>

              <div className="py-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Root cause
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  The transaction cannot be fully reconciled because the
                  corresponding ledger record is missing while Gateway reports
                  SUCCESS and Bank reports PENDING.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <div className="text-[10px] text-slate-600">
                      Confidence
                    </div>
                    <div className="mt-1 text-xl font-semibold text-cyan-300">
                      95%
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <div className="text-[10px] text-slate-600">
                      Priority
                    </div>
                    <div className="mt-1 text-xl font-semibold text-red-300">
                      HIGH
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    Recommended action
                  </div>

                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    Investigate and restore the missing ledger record, then
                    rerun reconciliation before changing transaction status.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06]">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>

            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Every transaction tells a story.
              <br />
              <span className="text-slate-500">
                Find it in seconds.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500">
              Investigate payment failures, settlement delays and
              reconciliation inconsistencies with LedgerLens.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              Start investigating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>© 2026 LedgerLens</div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Investigation engine operational
          </div>
        </div>
      </footer>
    </div>
  );
}