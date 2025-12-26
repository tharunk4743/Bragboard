import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { LeaderboardEntry } from "../../data/types";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Search,
  ArrowLeft,
} from "lucide-react";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const data = await apiService.getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = leaderboard.filter((e) =>
    (e.fullName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="py-20 text-center text-slate-400">
        Loading standings...
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-slate-400 hover:text-indigo-600 font-bold text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h2 className="text-3xl font-black text-slate-900">
            Team Leaderboard
          </h2>
          <p className="text-slate-500">Celebrating our most recognized contributors.</p>
        </div>
        <div className="hidden md:flex items-center px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
          <Medal className="w-5 h-5 text-amber-500 mr-2" />
          <span className="text-sm font-bold text-amber-700">
            Q4 Reward Cycle Active
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass rounded-3xl border p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Find a colleague..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 border-slate-100 transition-all"
              />
            </div>
          </div>

          <div className="glass rounded-[2.5rem] border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Rank
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Member
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Achievements
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((entry) => (
                  <tr
                    key={entry.userId}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div
                        className={`
                        w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm
                        ${
                          entry.rank === 1
                            ? "bg-amber-100 text-amber-600 shadow-sm"
                            : entry.rank === 2
                            ? "bg-slate-100 text-slate-500"
                            : entry.rank === 3
                            ? "bg-orange-100 text-orange-600"
                            : "text-slate-400"
                        }
                      `}
                      >
                        {entry.rank === 1 ? (
                          <Trophy className="w-5 h-5" />
                        ) : (
                          entry.rank
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <Avatar name={entry.fullName} src={(entry as any).avatarUrl ?? (entry as any).avatar_url ?? null} size="md" className="rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100" />
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {entry.fullName ?? ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900">
                      {entry.shoutoutCount}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{
                              width: `${
                                (entry.shoutoutCount /
                                  (leaderboard[0]?.shoutoutCount || 1)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl border p-8 bg-indigo-600 text-white relative overflow-hidden">
            <Star className="absolute -top-10 -right-10 w-40 h-40 opacity-10" />
            <h3 className="text-xl font-bold mb-4">
              You're in Rank #{"???"}
            </h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Every shoutout helps your team thrive. Keep up the excellent
              collaboration!
            </p>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-xl shadow-indigo-900/20">
              Share Achievement
            </button>
          </div>

          <div className="glass rounded-3xl border p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Hall of Fame</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs italic">
                  MVP
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-800">Jane Doe</p>
                  <p className="text-xs text-slate-500">Most Consistent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
