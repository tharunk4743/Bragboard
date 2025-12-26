import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { Shoutout, LeaderboardEntry } from "../../data/types";
import {
  MessageSquare,
  Heart,
  Clock,
  Search,
  Trophy,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Avatar from "../../components/Avatar";

const EmployeeDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sData, lData] = await Promise.all([
          apiService.getShoutouts(),
          apiService.getLeaderboard(),
        ]);
        setShoutouts(sData);
        setLeaderboard(lData);
      } catch (e) {
        console.error("Load failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredShoutouts = shoutouts.filter(
    (s) =>
      (s.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">
          Gathering team celebrations...
        </p>
      </div>
    );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Great work deserves to be seen.
          </h2>
          <p className="text-indigo-100 text-lg font-medium opacity-90 leading-relaxed mb-8">
            Stay updated with your team's achievements and share the love. Browse shoutouts and join the celebration.
          </p>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 glass rounded-full flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Active Week
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">
              Celebration Feed
            </h3>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search shoutouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm outline-none border"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-6">
            {filteredShoutouts.length > 0 ? (
              filteredShoutouts.map((shoutout) => (
                <div
                  key={shoutout.id}
                  className="glass rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-wrap gap-2">
                      {shoutout.recipients.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100"
                        >
                          <Avatar name={r.fullName} src={(r as any).avatar_url ?? (r as any).avatarUrl ?? null} size="xs" className="mr-2" />
                          <span className="text-xs font-bold text-indigo-700">
                            {r.fullName ?? ""}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-slate-400 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {new Date(shoutout.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Link to={`/shoutouts/${shoutout.id}`} className="block">
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3">
                      {shoutout.title}
                    </h4>
                    <p className="text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                      {shoutout.description}
                    </p>
                  </Link>

                  <div className="flex items-center pt-6 border-t border-slate-100 justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center text-slate-500 hover:text-red-500 transition-colors text-sm font-semibold">
                        <Heart className="w-5 h-5 mr-2" />
                        <span>12 Cheers</span>
                      </button>
                      <Link
                        to={`/shoutouts/${shoutout.id}`}
                        className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        <span>{shoutout.comments.length} Comments</span>
                      </Link>
                    </div>
                    <Link
                      to={`/shoutouts/${shoutout.id}`}
                      className="text-indigo-600 font-bold text-sm flex items-center hover:translate-x-1 transition-transform"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 glass rounded-3xl border border-dashed border-slate-300">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  No celebrations match your search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="glass rounded-3xl border p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Leaderboard</h3>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>

            <div className="space-y-6">
              {leaderboard.slice(0, 5).map((entry) => (
                <div key={entry.userId} className="flex items-center group">
                  <div
                    className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4
                    ${
                      entry.rank === 1
                        ? "bg-amber-100 text-amber-600"
                        : entry.rank === 2
                        ? "bg-slate-100 text-slate-500"
                        : entry.rank === 3
                        ? "bg-orange-100 text-orange-600"
                        : "bg-slate-50 text-slate-400"
                    }
                  `}
                  >
                    {entry.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {entry.fullName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {entry.shoutoutCount} recognitions
                    </p>
                  </div>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{
                        width: `${
                          (entry.shoutoutCount /
                            (leaderboard[0]?.shoutoutCount || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/leaderboard"
              className="w-full mt-10 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors block text-center"
            >
              View Full Standings
            </Link>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-3 text-amber-400 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Did you know?
              </h4>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Employees with shoutouts are 3x more likely to feel engaged at
                work.
              </p>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/100/100?random=${i}`}
                      alt="user"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/30">
                  +12
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
