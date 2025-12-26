import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { Shoutout, UserRole } from "../../data/types";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Calendar,
  User,
  Heart,
  Share2,
  Sparkles,
  Tag,
  ShieldCheck,
} from "lucide-react";

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const [shoutout, setShoutout] = useState<Shoutout | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await apiService.getShoutoutById(id);
        setShoutout(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id || !authState.user) return;
    setSubmitting(true);
    try {
      const newComment = await apiService.addComment(
        id,
        authState.user.id,
        authState.user.fullName,
        commentText
      );
      if (shoutout) {
        setShoutout({
          ...shoutout,
          comments: [...shoutout.comments, newComment],
        });
      }
      setCommentText("");
    } catch {
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheer = async () => {
    if (!id || !authState.user) return;
    try {
      const newCheers = await apiService.toggleCheer(id, authState.user.id);
      if (shoutout) {
        setShoutout({ ...shoutout, cheers: newCheers });
      }
    } catch {
      alert("Cheer failed");
    }
  };

  if (loading)
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-bold">Synchronizing history...</p>
      </div>
    );

  if (!shoutout)
    return (
      <div className="py-20 text-center glass rounded-3xl border border-dashed border-slate-200">
        <h2 className="text-2xl font-black text-slate-400">
          Celebration Not Found
        </h2>
        <Link
          to="/dashboard"
          className="mt-4 inline-block text-indigo-600 font-bold underline"
        >
          Return to Feed
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8 pb-20">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-black transition-all group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="glass rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden bg-white">
        <div className="p-8 md:p-16 space-y-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">
              {shoutout.category}
            </span>
            <span className="text-slate-300">|</span>
            <div className="flex flex-wrap gap-2">
                    {shoutout.recipients.map((r) => (
                <div
                  key={r.id}
                  className="inline-flex items-center px-4 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black mr-2">
                    {r.fullName?.charAt(0) ?? ""}
                  </div>
                  <span className="text-sm font-black text-indigo-900">
                    {r.fullName ?? ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
              {shoutout.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">
              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                {new Date(shoutout.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </div>
              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                Verified Recognition
              </div>
              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <User className="w-3.5 h-3.5 mr-2 text-violet-500" />
                Published by Administrator
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
                {shoutout.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 text-[9px] font-black uppercase tracking-wider shadow-sm"
              >
                <Tag className="w-3 h-3 text-indigo-500" />
                {skill}
              </span>
            ))}
          </div>

          <div className="relative p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
            <div className="absolute top-4 left-4 opacity-5">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            <p className="text-2xl text-slate-700 leading-relaxed font-bold italic relative z-10">
              "{shoutout.description}"
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleCheer}
              className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black shadow-xl transition-all active:scale-95 border group ${
                shoutout.cheers.includes(authState.user?.id || "")
                  ? "bg-rose-600 text-white border-rose-600 shadow-rose-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600 shadow-slate-100 hover:border-rose-100"
              }`}
            >
              <Heart
                className={`w-7 h-7 transition-all ${
                  shoutout.cheers.includes(authState.user?.id || "")
                    ? "fill-white"
                    : "group-hover:scale-110"
                }`}
              />
              <span className="text-lg">
                {shoutout.cheers.length} Cheers
              </span>
            </button>
            <button className="p-5 bg-slate-900 text-white rounded-[2rem] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
              <Share2 className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-slate-50/70 p-8 md:p-16 border-t border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 flex items-center mb-12">
            <MessageSquare className="w-9 h-9 mr-4 text-indigo-600" />
            Impact Discussion
            <span className="ml-4 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-400">
              {shoutout.comments.length}
            </span>
          </h3>

          <div className="space-y-10">
                {shoutout.comments.map((c) => (
              <div key={c.id} className="flex gap-6 group">
                <div className="w-14 h-14 rounded-[1.25rem] bg-white border border-slate-100 shadow-md flex items-center justify-center text-indigo-600 font-black text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {c.userName?.charAt(0) ?? ""}
                </div>
                <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:border-indigo-100 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-black text-slate-900">
                      {c.userName ?? ""}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed text-lg">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
            {shoutout.comments.length === 0 && (
              <div className="py-20 text-center text-slate-400 font-black italic uppercase tracking-widest text-sm bg-white/50 border border-dashed border-slate-200 rounded-[2.5rem]">
                Join the conversation and congratulate your team!
              </div>
            )}
          </div>

          {authState.user?.role === UserRole.EMPLOYEE && (
            <form
              onSubmit={handlePostComment}
              className="relative mt-20 group"
            >
              <textarea
                rows={5}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a congratulatory message for your peers..."
                className="w-full px-10 py-8 rounded-[3rem] border border-slate-200 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none pr-28 font-medium text-slate-900 text-lg shadow-sm"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="absolute right-6 bottom-6 bg-slate-900 text-white p-5 rounded-[1.75rem] shadow-2xl hover:bg-indigo-600 disabled:opacity-50 transition-all active:scale-95 group-hover:shadow-indigo-200"
              >
                <Send className="w-7 h-7" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
