import React, { useState } from "react";
import {
  Lock,
  Bell,
  Eye,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordForm.new !== passwordForm.confirm) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.new.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate API
    setSuccess("Password updated successfully!");
    setPasswordForm({ current: "", new: "", confirm: "" });
    setLoading(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
          Account Center
        </h2>
        <p className="text-slate-500 font-medium">
          Fine-tune your experience and security preferences.
        </p>
      </div>

      {success && (
        <div className="flex items-center p-5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-[1.5rem] font-bold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 mr-3" />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-[1.5rem] font-bold animate-fade-in shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Security Section */}
        <div className="glass rounded-[2.5rem] border border-slate-100 p-10 space-y-8 bg-white shadow-sm">
          <div className="flex items-center space-x-4 text-indigo-600">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Security Credentials
            </h3>
          </div>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.new}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, new: e.target.value })
                  }
                  placeholder="Min. 8 chars"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm: e.target.value,
                    })
                  }
                  placeholder="Repeat new"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Apply New Password"
              )}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="glass rounded-[2.5rem] border border-slate-100 p-10 space-y-8 bg-white shadow-sm">
          <div className="flex items-center space-x-4 text-indigo-600">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Notification Channels
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group">
              <div>
                <p className="font-black text-slate-900">Email Dispatch</p>
                <p className="text-xs text-slate-500 font-medium">
                  Real-time alerts for shoutouts and cheers
                </p>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group">
              <div>
                <p className="font-black text-slate-900">
                  Weekly Pulse Digest
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Monday morning recap of team wins
                </p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative shadow-inner">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass rounded-[2.5rem] border border-slate-100 p-10 space-y-8 bg-white shadow-sm">
          <div className="flex items-center space-x-4 text-indigo-600">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Visibility Settings
            </h3>
          </div>
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group">
            <div>
              <p className="font-black text-slate-900">Leaderboard Listing</p>
              <p className="text-xs text-slate-500 font-medium">
                Broadcast my achievements to the company directory
              </p>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full relative shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 text-center">
        <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-6 py-2 rounded-full border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Data Encryption Protocol v2.4 Enabled
        </div>
      </div>
    </div>
  );
};

export default Settings;
