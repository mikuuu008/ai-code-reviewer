import { useEffect, useState } from "react";


const BASE_URL = "http://127.0.0.1:8000";

export default function History() {

  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Failed");
      }

      setHistory(Array.isArray(data?.history)
        ? data.history
        : []);

    } catch (err) {
      console.log(err);
      setError("❌ Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) =>
    (item?.content || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      

      <h1 className="text-5xl font-bold mb-8 mt-10">
        📜 History
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search history..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl bg-slate-800"
      />

      <div className="bg-slate-900 p-6 rounded-2xl">

        {loading && (
          <p className="text-cyan-400 animate-pulse">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}

        {!loading && filteredHistory.length === 0 && (
          <p className="text-slate-400">
            No history found...
          </p>
        )}

        <div className="space-y-4 mt-4">

          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-cyan-500 transition"
            >

              <div className="flex justify-between">
                <p className="text-green-300 text-sm">
                  {item.type || "unknown"}
                </p>

                <p className="text-slate-400 text-xs">
                  #{item.id}
                </p>
              </div>

              <p className="mt-3 text-cyan-300">
                {item.content || "No content"}
              </p>

              <p className="text-white mt-4">
                {item.response || "No response"}
              </p>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}