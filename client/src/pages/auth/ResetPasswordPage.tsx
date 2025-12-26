// client/src/pages/auth/ResetPasswordPage.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { apiService } from "../../services/apiService";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Logo from "../../components/Logo";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = searchParams.get("token") || "";
      await apiService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-indigo-100">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300">
            <Logo className="w-24 h-24 drop-shadow-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Create a strong new password for your account.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-sm border bg-white relative">
          {!success ? (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-fade-in">
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium bg-white/50 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
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
                  <span>Update Password</span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Success!
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Your password has been reset successfully. <br />
                Redirecting you to login...
              </p>
              <Link
                to="/login"
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                Go to Sign In manually
              </Link>
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

export default ResetPasswordPage;
