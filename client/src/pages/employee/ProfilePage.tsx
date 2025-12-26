import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import {
  Shield,
  User,
  Mail,
  Calendar,
  Settings,
  Lock,
  X,
  Loader2,
  Check,
} from "lucide-react";
import Avatar from "../../components/Avatar";

const ProfilePage: React.FC = () => {
  const { authState, updateUser } = useAuth();
  const { user } = authState;

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState((user as any)?.department || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      let finalAvatar = avatarUrl;
      if (file) {
        // upload file first
        const uploadResp: any = await apiService.uploadAvatar(user.id, file);
        finalAvatar = uploadResp?.avatar_url ?? uploadResp?.avatarUrl ?? finalAvatar;
      }
      const updated = await apiService.updateUserProfile(user.id, { fullName, avatarUrl: finalAvatar, department });
      updateUser(updated);      // Sync local edit inputs so reopening modal shows the latest values
      setFullName(updated.full_name ?? updated.fullName ?? fullName);
      setAvatarUrl(updated.avatar_url ?? updated.avatarUrl ?? finalAvatar);
      setDepartment(updated.department ?? department);      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8 pb-20">
      <div className="relative">
        {/* Header Banner */}
        <div className="h-48 w-full bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] shadow-xl" />

        {/* Profile Card Overlay */}
        <div className="px-8 -mt-16">
          <div className="glass rounded-[2.5rem] border shadow-lg p-10 bg-white">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
              <div className="relative">
                <div>
                  <Avatar name={user.fullName} src={(user as any).avatarUrl ?? (user as any).avatar_url ?? null} size="xl" className="rounded-3xl bg-white border-4 border-white shadow-xl text-indigo-600 overflow-hidden" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {user.fullName ?? ""}
                </h2>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs">
                  {user.role ?? ""}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                  <div className="flex items-center text-slate-500 text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-slate-500 text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center self-center md:self-start"
              >
                <Settings className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="flex items-center justify-center p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl font-bold animate-fade-in mx-8">
          <Check className="w-5 h-5 mr-2" />
          {message}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-3xl w-full max-w-md shadow-2xl border overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Avatar URL (optional)
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://.../avatar.png"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <div className="mt-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Or upload avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Email updates require administrator approval.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 px-8">
        <div className="glass rounded-3xl border p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center">
            <Lock className="w-5 h-5 mr-3 text-indigo-600" />
            Security
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Update your account password regularly to stay secure.
            </p>
            <button className="w-full py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
              Change Password
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl border p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center">
            <Settings className="w-5 h-5 mr-3 text-indigo-600" />
            Quick Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
              <span className="text-sm font-medium text-slate-700">
                Email Notifications
              </span>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
              <span className="text-sm font-medium text-slate-700">
                Public Leaderboard Profile
              </span>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
