import { motion } from "motion/react";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top glow */}
      <motion.div
        className="absolute -top-48 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[0.035] blur-[120px]"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Left glow */}
      <motion.div
        className="absolute -left-64 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/[0.025] blur-[100px]"
        animate={{
          y: [0, 60, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Right glow */}
      <motion.div
        className="absolute -right-64 top-2/3 h-[450px] w-[450px] rounded-full bg-violet-500/[0.025] blur-[110px]"
        animate={{
          y: [0, -70, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#07090d_100%)]" />
    </div>
  );
}