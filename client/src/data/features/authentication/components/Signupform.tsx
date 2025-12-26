import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ArrowLeft, Loader2, User, Mail, Lock } from "lucide-react";
import { UserRole } from "../../../data/types";  // Add this import

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(email, fullName, password, role);  // Pass role
    } catch (err: any) {
      console.error("Signup error", err);
      const detail = err?.response?.data?.detail;
      let message = "Registration failed.";
      if (Array.isArray(detail)) {
        // pydantic returns array of errors
        message = detail.map((d: any) => (d.msg ? d.msg : JSON.stringify(d))).join("; ");
      } else if (typeof detail === "string") {
        message = detail;
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass rounded-3xl p-8 shadow-sm border bg-white">
        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-indigo-600" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-indigo-600" />
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
            />
          </div>

          {/* ADD THIS ROLE TOGGLE */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-indigo-600" />
              Role
            </label>
            <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.EMPLOYEE)}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                  role === "EMPLOYEE"
                    ? "bg-white text-indigo-600 shadow-sm shadow-indigo-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Employee
              </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.ADMIN)}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                  role === "ADMIN"
                    ? "bg-white text-indigo-600 shadow-sm shadow-indigo-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-indigo-600" />
              Create Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Register Account</span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          By signing up, you agree to our Terms and Data Policy.
        </p>
      </div>
    </>
  );
};

export default SignupForm;
