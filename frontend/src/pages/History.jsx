import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("❌ Please login first");
          return;
        }

        const res = await fetch("/history", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || "Failed to load history");
          return;
        }

        setHistory(data.history || []);
      } catch (err) {
        console.log(err);
        setError("❌ Server connection failed");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-5xl font-bold mb-8 mt-10">
        📜 History
      </h1>

      <div className="bg-slate-900 p-8 rounded-2xl">

        {error && (
          <p className="text-red-400 mb-3">{error}</p>
        )}

        {history.length === 0 && !error ? (
          <p>No history yet...</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="mb-4 p-3 bg-slate-800 rounded">
              <p><b>Code:</b> {item[2]}</p>
              <p><b>Review:</b> {item[3]}</p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}