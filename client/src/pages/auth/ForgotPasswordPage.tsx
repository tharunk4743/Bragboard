import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../services/apiService";
import {
  ArrowLeft,
  Loader2,
  Mail,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react";
import Logo from "../../components/Logo";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resp: any = await apiService.requestPasswordReset(email);
      // If backend returned a token (dev mode), redirect to reset page with token
      if (resp?.token) {
        window.location.href = `/reset-password?token=${resp.token}`;
        return;
      }
      setSubmitted(true);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (detail === "User not found") {
        setError("No account exists with this email address.");
      } else {
        setError(err.message || "Failed to request password reset.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-indigo-100">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold text-sm transition-all group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
            <Logo className="w-24 h-24 drop-shadow-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Recover Password
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            We'll send a recovery link to your inbox.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-sm border bg-white relative">
          {!submitted ? (
            <form onSubmit={handleRequest} className="space-y-6">
              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-fade-in">
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium bg-white/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Check your inbox!
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                We've sent a password recovery link to <br />
                <span className="font-bold text-slate-900">{email}</span>
              </p>

              <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-left flex items-start shadow-sm">
                <Info className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-indigo-800 font-medium leading-relaxed">
                  <p className="font-bold mb-1 uppercase tracking-tight">
                    Developer Note
                  </p>
                  Real email delivery requires a validated domain in Resend. For
                  testing, you can use the{" "}
                  <Link
                    to="/reset-password"
                    title="Test reset page"
                    className="font-bold underline text-indigo-900"
                  >
                    Direct Reset Page
                  </Link>{" "}
                  to continue.
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="flex items-center justify-center mx-auto gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Try another email
              </button>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Infosys 6.0 internship project Group D Tharun
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
