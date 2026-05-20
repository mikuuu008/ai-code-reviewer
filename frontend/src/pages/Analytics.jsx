import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Analytics() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    setLoading(true);

    try {
      // USING YOUR EXISTING BACKEND (NO NEW ROUTE NEEDED)
      const res = await fetch("http://127.0.0.1:8000/history");
      const data = await res.json();

      const history = data.history || [];

      // calculate analytics in frontend
      const total = history.length;

      const chat = history.filter(h => h.review && !h.code).length;
      const code = history.filter(h => h.code).length;

      setStats({
        total_requests: total,
        chat_requests: chat,
        code_requests: code
      });

    } catch (err) {
      console.log("Analytics error:", err);
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <Navbar />

      <h1 className="text-5xl font-bold mb-8 mt-10">
        📈 Analytics Dashboard
      </h1>

      <button
        onClick={fetchStats}
        className="mb-6 bg-cyan-500 px-4 py-2 rounded-xl hover:bg-cyan-600"
      >
        🔄 Refresh Data
      </button>

      {loading ? (
        <p className="text-slate-400">Loading analytics...</p>
      ) : (

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-cyan-400">Total Requests</h2>
            <p className="text-3xl mt-3">{stats?.total_requests}</p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-green-400">Chat Requests</h2>
            <p className="text-3xl mt-3">{stats?.chat_requests}</p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-400">Code Requests</h2>
            <p className="text-3xl mt-3">{stats?.code_requests}</p>
          </div>

        </div>
      )}

    </div>
  );
}