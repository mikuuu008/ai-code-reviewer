import { useState } from "react";
import Navbar from "../components/Navbar";

function Dashboard() {

  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [lang, setLang] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleReview = async () => {

    if (!code.trim()) {
      setReview("⚠️ Please enter code");
      return;
    }

    setLoading(true);
    setReview("");
    setStatus("");

    try {

      const response = await fetch("http://127.0.0.1:8000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code,
          lang,
        }),
      });

      const data = await response.json();

      console.log("REVIEW RESPONSE:", data);

      if (!response.ok) {
        setReview(data.detail || "Backend error");
        setStatus("error");
        return;
      }

      setReview(data.review);

      // optional status from backend
      if (data.status) {
        setStatus(data.status);
      }

    } catch (error) {

      console.log("NETWORK ERROR:", error);

      setReview("❌ Backend connection failed");
      setStatus("error");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <Navbar />

      <h1 className="text-4xl font-bold mt-8 mb-6">
        💻 AI Code Hero Dashboard
      </h1>

      {/* LANGUAGE SELECT */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="mb-4 bg-slate-800 p-2 rounded text-white"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="csharp">C#</option>
      </select>

      {/* CODE INPUT */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Type or paste your code..."
        className="w-full h-64 bg-slate-900 p-4 rounded-xl border border-cyan-500"
      />

      {/* BUTTON */}
      <div className="flex gap-4 mt-4 flex-wrap">

        <button
          onClick={handleReview}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-xl font-bold disabled:opacity-50"
        >
          {loading ? "⏳ Analyzing Code..." : "🚀 Review Code"}
        </button>

      </div>

      {/* STATUS */}
      {status && (
        <div className="mt-4">
          {status === "reviewed" && (
            <p className="text-yellow-400">⚠️ Issues detected in your code</p>
          )}
          {status === "success" && (
            <p className="text-green-400">✅ No issues found</p>
          )}
          {status === "error" && (
            <p className="text-red-400">❌ Something went wrong</p>
          )}
        </div>
      )}

      {/* REVIEW OUTPUT */}
      {review && (
        <div className="mt-6 bg-slate-900 p-4 rounded-xl border border-slate-700">
          <pre className="whitespace-pre-wrap text-sm leading-6">
            {review}
          </pre>
        </div>
      )}

    </div>
  );
}

export default Dashboard;