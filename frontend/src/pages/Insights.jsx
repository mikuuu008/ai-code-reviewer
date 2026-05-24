import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const BASE_URL = "http://127.0.0.1:8000";

export default function Insights() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    chat: 0,
    code: 0,
  });

  const [loading, setLoading] = useState(true);

  const COLORS = ["#06b6d4", "#22c55e"];

  // ================= FETCH ANALYTICS =================
  const fetchStats = async () => {
    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const history = Array.isArray(data.history)
        ? data.history
        : [];

      const total = history.length;

      const chat = history.filter(
        (h) => h.type === "chat"
      ).length;

      const code = history.filter(
        (h) => h.type === "code"
      ).length;

      setStats({
        total,
        chat,
        code,
      });

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const pieData = [
    { name: "Chat", value: stats.chat },
    { name: "Code", value: stats.code },
  ];

  const barData = [
    { name: "Total", value: stats.total },
    { name: "Chat", value: stats.chat },
    { name: "Code", value: stats.code },
  ];

  const lineData = [
    { day: "Mon", usage: stats.total * 0.2 },
    { day: "Tue", usage: stats.total * 0.5 },
    { day: "Wed", usage: stats.total * 0.3 },
    { day: "Thu", usage: stats.total * 0.8 },
    { day: "Fri", usage: stats.total },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 overflow-hidden">

      {/* ================= DOG BUTTON ================= */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-5 right-5 z-50 group"
      >

        <div className="relative">

          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-70 animate-pulse"></div>

          <div className="relative bg-slate-900 border-4 border-yellow-400 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition duration-300 animate-bounce">

            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="dog"
              className="w-16 h-16"
            />

          </div>

        </div>

      </button>

      {/* ================= TITLE ================= */}
      <div className="text-center mt-10">

        <h1 className="text-6xl font-black text-cyan-400">
          📊 AI Insights
        </h1>

        <p className="text-slate-400 mt-4 text-lg">
          Real-time AI system analytics dashboard
        </p>

      </div>

      {/* ================= LOADING ================= */}
      {loading ? (

        <div className="flex justify-center items-center mt-32">
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6 mt-16">

          {/* ================= TOTAL CARD ================= */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-cyan-500">

            <h2 className="text-2xl font-bold text-cyan-400">
              🚀 Total Activity
            </h2>

            <h1 className="text-7xl font-black mt-6">
              {stats.total}
            </h1>

          </div>

          {/* ================= PIE CHART ================= */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-green-500">

            <h2 className="text-2xl font-bold text-green-400 mb-6">
              🧠 Chat vs Code
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={120}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

          </div>

          {/* ================= BAR CHART ================= */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-pink-500">

            <h2 className="text-2xl font-bold text-pink-400 mb-6">
              📈 Usage Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* ================= LINE CHART ================= */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-yellow-500">

            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              ⚡ Weekly Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#22c55e"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

      )}
    </div>
  );
}