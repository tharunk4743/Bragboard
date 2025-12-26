import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { UserRole } from "../../../data/types";
import {
  Shield,
  User,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

type LoginFormProps = {
  onLoginSuccess?: (user: { role: string }) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // assume login returns { user: { role: "ADMIN" | "EMPLOYEE", ... }, token: string, ... }
      const resp = await login(
        email,
        password,
        role,
        role === UserRole.ADMIN ? secretCode : undefined
      );

      if (onLoginSuccess && resp?.user) {
        onLoginSuccess(resp.user);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-sm border bg-white relative">
      {/* Role Toggle */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
        <button
          onClick={() => setRole(UserRole.EMPLOYEE)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            role === UserRole.EMPLOYEE
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Employee</span>
        </button>
        <button
          onClick={() => setRole(UserRole.ADMIN)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            role === UserRole.ADMIN
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Administrator</span>
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Work Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white/50"
          />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              title="Recover account"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white/50 pr-12"
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

        {role === UserRole.ADMIN && (
          <div className="animate-fade-in">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Admin Secret Code
            </label>
            <input
              type="password"
              required
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Organization code"
              className="w-full px-4 py-3 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 bg-white/50"
            />
            <p className="mt-2 text-xs text-slate-400">
              Restricted to verified system managers.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>Continue to Dashboard</span>
          )}
        </button>
      </form>

      {role === UserRole.EMPLOYEE && (
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-bold ml-1"
            >
              Join BragBoard
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
