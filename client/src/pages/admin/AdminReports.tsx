import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { LeaderboardEntry } from "../../data/types";
import {
  FileText,
  Download,
  TrendingUp,
  PieChart,
  Users,
  Star,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const AdminReports: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const lData = await apiService.getLeaderboard();
        setLeaderboard(lData);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const exportCSV = () => {
    const headers = ["Rank", "Name", "Total Shoutouts"];
    const rows = leaderboard.map((l) => [l.rank, l.fullName, l.shoutoutCount]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `bragboard_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  if (loading)
    return (
      <div className="py-20 text-center text-slate-400">
        Loading analysis...
      </div>
    );

  const chartData = leaderboard.slice(0, 10);
  const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Analytics & Reports
          </h2>
          <p className="text-slate-500 mt-1">
            Deep dive into organization culture and participation.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportCSV}
            className="flex items-center px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <FileText className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Platform Engagement",
            value: "94%",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Monthly Growth",
            value: "+12.5%",
            icon: ArrowUpRight,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Active Users",
            value: leaderboard.length.toString(),
            icon: Users,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "Avg Recognition",
            value: "4.2",
            icon: Star,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass rounded-3xl p-6 border flex flex-col items-center text-center"
          >
            <div
              className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <h4 className="text-2xl font-black text-slate-900">
              {stat.value}
            </h4>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recognition Distribution chart */}
        <div className="lg:col-span-2 glass rounded-3xl border p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">
              Recognition Distribution
            </h3>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="fullName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    backgroundColor: "#ffffff",
                    color: "#0f172a", // dark text
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="shoutoutCount" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Elite Contributors list */}
        <div className="glass rounded-3xl border p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">
            Elite Contributors
          </h3>
          <div className="space-y-4">
            {leaderboard.slice(0, 8).map((l) => (
              <div
                key={l.userId}
                className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-500 w-4">
                    {l.rank}
                  </span>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {l.fullName}
                  </p>
                </div>
                <span className="text-xs font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-50 shadow-sm">
                  {l.shoutoutCount}
                </span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-sm text-slate-500">
                No recognition activity yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
