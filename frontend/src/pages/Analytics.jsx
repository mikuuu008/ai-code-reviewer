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
  CartesianGrid,
} from "recharts";

const BASE_URL = "http://127.0.0.1:8000";

export default function Analytics() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    chat: 0,
    code: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH ANALYTICS =================
  const fetchStats = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("⚠️ Please login first");
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await res.json();

      const history = Array.isArray(data?.history)
        ? data.history
        : [];

      let total = history.length;
      let chat = 0;
      let code = 0;

      history.forEach((item) => {

        if (!item) return;

        if (item.type === "chat") {
          chat++;
        }

        if (item.type === "code") {
          code++;
        }

      });

      setStats({
        total,
        chat,
        code,
      });

      setError("");

    } catch (err) {

      console.log(err);

      setError("❌ Failed to load analytics");

    } finally {

      setLoading(false);

    }

  };

  // ================= LOAD =================
  useEffect(() => {

    fetchStats();

    // AUTO REFRESH
    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // ================= SAFE CHART DATA =================
  const pieData = [
    {
      name: "Chat",
      value: Number(stats.chat) || 0,
    },
    {
      name: "Code",
      value: Number(stats.code) || 0,
    },
  ];

  const barData = [
    {
      name: "Total",
      value: Number(stats.total) || 0,
    },
    {
      name: "Chat",
      value: Number(stats.chat) || 0,
    },
    {
      name: "Code",
      value: Number(stats.code) || 0,
    },
  ];

  const lineData = [
    {
      day: "Mon",
      usage: Number(stats.total) * 0.2,
    },
    {
      day: "Tue",
      usage: Number(stats.total) * 0.4,
    },
    {
      day: "Wed",
      usage: Number(stats.total) * 0.6,
    },
    {
      day: "Thu",
      usage: Number(stats.total) * 0.8,
    },
    {
      day: "Fri",
      usage: Number(stats.total),
    },
  ];

  const COLORS = ["#38bdf8", "#22c55e"];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-black text-cyan-400">
            📊 Analytics Dashboard
          </h1>

          <p className="text-slate-400 mt-3">
            Real-time AI system analytics
          </p>

        </div>

        {/* ================= DOG BUTTON ================= */}
        <button
          onClick={() => navigate("/insights")}
          className="group relative bg-slate-900 border-2 border-cyan-400 px-6 py-4 rounded-3xl shadow-2xl hover:scale-110 transition-all duration-300"
        >

          <div className="flex items-center gap-3">

            <div className="text-5xl animate-bounce">
              🐶
            </div>

            <div className="text-left">
              <h2 className="font-black text-cyan-400 text-lg">
                AI Insights
              </h2>

              <p className="text-slate-300 text-sm">
                Open smart analytics
              </p>
            </div>

          </div>

          {/* GLOW */}
          <div className="absolute inset-0 rounded-3xl bg-cyan-400 opacity-10 blur-xl group-hover:opacity-30 transition-all"></div>

        </button>

      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-2xl mb-6 shadow-lg">
          {error}
        </div>
      )}

      {/* ================= LOADING ================= */}
      {loading ? (

        <div className="flex justify-center items-center mt-32">

          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {/* ================= PIE CHART ================= */}
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-cyan-500">

            <h2 className="text-2xl font-bold mb-6 text-cyan-400">
              💬 Chat vs Code
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={110}
                  label
                >

                  {pieData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* ================= BAR CHART ================= */}
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-green-500">

            <h2 className="text-2xl font-bold mb-6 text-green-400">
              📈 Usage Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={barData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#38bdf8"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* ================= LINE CHART ================= */}
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-pink-500 md:col-span-2">

            <h2 className="text-2xl font-bold mb-6 text-pink-400">
              🚀 Activity Trend
            </h2>

            <ResponsiveContainer width="100%" height={320}>

              <LineChart data={lineData}>

                <CartesianGrid strokeDasharray="3 3" />

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

          {/* ================= STATS CARDS ================= */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-yellow-500">

            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              🧠 Total Chats
            </h2>

            <h1 className="text-6xl font-black">
              {stats.chat}
            </h1>

          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-purple-500">

            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              💻 Total Code Reviews
            </h2>

            <h1 className="text-6xl font-black">
              {stats.code}
            </h1>

          </div>

        </div>

      )}

    </div>

  );
}