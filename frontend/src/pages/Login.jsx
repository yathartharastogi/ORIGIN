
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(form);

      if (!response.success) {
        setError(
          response.error?.message ||
            "Unable to login."
        );

        return;
      }

      const destination =
        location.state?.from?.pathname ||
        "/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-4">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.06] blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            LedgerLens
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Payment Investigation Intelligence
          </p>
        </div>

        <Card className="border-white/[0.08] bg-white/[0.025] shadow-2xl backdrop-blur-xl">
          <CardContent className="p-6 sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Welcome back
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign in to access the investigation center.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Login form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Email
                </label>

                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-11 border-white/[0.08] bg-white/[0.03] text-white placeholder:text-slate-600"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="h-11 border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-cyan-500 font-medium text-slate-950 hover:bg-cyan-400"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in

                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sample Login */}
            <div className="mt-5 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.04] px-4 py-3">
              <p className="text-xs font-medium text-cyan-400">
                Sample Login
              </p>

              <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                <p>
                  Email:{" "}
                  <span className="font-mono text-slate-300">
                    test@test.com
                  </span>
                </p>

                <p>
                  Password:{" "}
                  <span className="font-mono text-slate-300">
                    test12345
                  </span>
                </p>
              </div>
            </div>

            {/* Register */}
            <div className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Create one
              </Link>
            </div>

          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-slate-600">
          Secure access • HTTP-only authentication • LedgerLens
        </p>
      </motion.div>
    </div>
  );
}
