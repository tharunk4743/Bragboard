import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { LeaderboardEntry } from "../../data/types";
import {
  Download,
  TrendingUp,
  Users,
  Star,
  ArrowUpRight,
  Printer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Reports: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiService.getLeaderboard();
        setLeaderboard(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const exportCSV = () => {
    const headers = [
      "Rank",
      "Name",
      "Shoutouts Received",
      "Cheers",
      "BragPoints",
    ];
    const rows = leaderboard.map((l) => [
      l.rank,
      l.fullName,
      l.shoutoutCount,
      l.cheerCount,
      l.points,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `BragBoard_Report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="py-20 text-center text-slate-600 font-bold flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        Analyzing Culture Data...
      </div>
    );

  return (
    <div className="space-y-10 animate-fade-in pb-20 print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Analytics & Insights
          </h2>
          <p className="text-slate-600 font-medium">
            Measuring organization impact and engagement metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportCSV}
            className="flex items-center px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Printer className="w-4 h-4 mr-2" />
            Generate PDF
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
        {[
          {
            label: "Active Talent",
            value: leaderboard.length.toString(),
            icon: Users,
            bg: "bg-indigo-50",
            text: "text-indigo-600",
          },
          {
            label: "Avg Engagement",
            value: "92.4%",
            icon: TrendingUp,
            bg: "bg-emerald-50",
            text: "text-emerald-600",
          },
          {
            label: "Recognition Velocity",
            value: "+14.2%",
            icon: ArrowUpRight,
            bg: "bg-violet-50",
            text: "text-violet-600",
          },
          {
            label: "Points Circulation",
            value: leaderboard
              .reduce((acc, curr) => acc + curr.points, 0)
              .toLocaleString(),
            icon: Star,
            bg: "bg-amber-50",
            text: "text-amber-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass rounded-3xl p-6 border border-slate-100 flex flex-col items-center shadow-sm bg-white print:border-slate-300"
          >
            <div
              className={`w-12 h-12 ${stat.bg} ${stat.text} rounded-2xl flex items-center justify-center mb-4 print:hidden`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <h4 className="text-2xl font-black text-slate-900">
              {stat.value}
            </h4>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 print:block">
        <div className="lg:col-span-2 glass rounded-3xl border border-slate-100 p-8 bg-white shadow-sm print:shadow-none print:border-slate-300">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Recognition Distribution
          </h3>
          <div className="h-[400px] w-full print:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaderboard.slice(0, 10)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="fullName"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#475569",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#475569",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow:
                      "0 10px 15px -3px rgba(0,0,0,0.1)",
                    color: "#0f172a",
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="shoutoutCount"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl border border-slate-100 p-8 bg-white shadow-sm print:mt-10 print:border-slate-300 print:shadow-none">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Elite Contributors
          </h3>
          <div className="space-y-4">
            {leaderboard.slice(0, 8).map((l, idx) => (
              <div
                key={l.userId}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400 w-4">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {l.fullName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-indigo-600">
                    {l.shoutoutCount} Wins
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {l.points} BP
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { background: white !important; }
          .glass { background: white !important; backdrop-filter: none !important; }
          header, aside, button, nav { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          .max-w-6xl { max-width: 100% !important; }
        }
      `,
        }}
      />
    </div>
  );
};

export default Reports;
