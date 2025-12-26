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
  FileText,
  X,
} from "lucide-react";
import Avatar from "../../components/Avatar";

const ShoutoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();

  const [shoutout, setShoutout] = useState<Shoutout | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // reporting state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoutout || !reportTitle.trim() || !reportContent.trim() || !authState.user) return;
    setReportSubmitting(true);
    try {
      await apiService.createReport({ title: reportTitle, content: reportContent, target_type: 'shoutout', target_id: shoutout.id });
      alert('Report submitted');
      setReportOpen(false);
      setReportTitle('');
      setReportContent('');
    } catch (err) {
      alert('Failed to submit report');
    } finally {
      setReportSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await apiService.getShoutoutById(id);
        setShoutout(data);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
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
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );

  if (!shoutout)
    return (
      <div className="py-20 text-center text-slate-500 font-bold">
        Shoutout not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8 pb-20">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Link>

      <div className="glass rounded-[2.5rem] border shadow-sm overflow-hidden bg-white">
        {/* Main Content Card */}
        <div className="p-8 md:p-12 space-y-8">
          <div className="flex flex-wrap gap-3">
            {shoutout.recipients.map((r) => (
              <div
                key={r.id}
                className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl"
              >
                <Avatar name={r.fullName} size="sm" className="mr-2 rounded-full" />
                <span className="text-sm font-bold text-indigo-700">
                  {r.fullName ?? ""}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
              {shoutout.title}
            </h1>
            <div className="flex flex-wrap items-center space-x-6 text-slate-400 text-sm font-medium pb-6 border-b border-slate-100 gap-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(shoutout.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Posted by HR Team
              </div>
            </div>
          </div>

          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            {shoutout.description}
          </p>

          <div className="flex items-center space-x-4 pt-4">
            <button className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all border border-red-100">
              <Heart className="w-5 h-5 fill-red-600" />
              <span>24 Hearts</span>
            </button>
            <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => setReportOpen(true)} className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-100 hover:bg-amber-100 transition-colors">
              <FileText className="w-4 h-4 mr-2 inline-block" />
              Report
            </button>
          </div>

          {/* Report Modal */}
          {reportOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="glass rounded-3xl w-full max-w-md shadow-2xl border overflow-hidden p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold">Report Shoutout</h4>
                  <button onClick={() => setReportOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Reason</label>
                    <input type="text" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Short title (e.g. inappropriate content)" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Details</label>
                    <textarea rows={4} value={reportContent} onChange={(e) => setReportContent(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Describe the issue..." />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button type="button" onClick={() => setReportOpen(false)} className="py-2 px-4 rounded-xl bg-slate-100 font-bold">Cancel</button>
                    <button type="submit" disabled={reportSubmitting || !reportContent.trim() || !reportTitle.trim()} className="py-2 px-4 rounded-xl bg-amber-600 text-white font-bold disabled:opacity-60">{reportSubmitting ? 'Sending...' : 'Submit Report'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="bg-slate-50/50 p-8 md:p-12 space-y-8 border-t">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-indigo-600" />
            Conversation ({shoutout.comments.length})
          </h3>

          <div className="space-y-6">
            {shoutout.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4 group">
                <Avatar name={comment.userName} size="md" className="flex-shrink-0 rounded-2xl bg-white text-indigo-600" />
                <div className="flex-1 bg-white p-5 rounded-3xl border shadow-sm group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}

            {shoutout.comments.length === 0 && (
              <p className="text-center text-slate-400 font-medium py-10 italic">
                Be the first to say something nice!
              </p>
            )}
          </div>

          {/* Post Comment Area */}
          {authState.user?.role === UserRole.EMPLOYEE && (
            <form onSubmit={handlePostComment} className="relative mt-12">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a congratulatory message..."
                className="w-full px-6 py-4 rounded-3xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm pr-20"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="absolute right-4 bottom-4 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoutoutDetail;
