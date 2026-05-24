import { useState } from "react";

function Dashboard() {

  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [lang, setLang] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // 🤖 AI TEDDY STATE (ADDED)
  const [assistantOpen, setAssistantOpen] = useState(false);

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

      {/* 🧸 TEDDY ANIMATION TOP BAR */}
      <div className="relative w-full overflow-hidden h-20 mb-4">

        <div className="teddy-brown">🧸</div>
        <div className="teddy-cream">🧸</div>

      </div>

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

      {/* 🤖 AI TEDDY ASSISTANT (ADDED EXACTLY) */}
      <div className="ai-teddy-container">

        <div
          className="ai-teddy"
          onClick={() => setAssistantOpen(!assistantOpen)}
        >
          🧸
        </div>

        {assistantOpen && (
          <div className="ai-bubble">
            <p>🤖 Hey! I’m your AI Teddy Assistant</p>
            <p>💡 Need help with your code?</p>
            <p>🚀 Click "Review Code" to analyze it</p>
          </div>
        )}

      </div>

      {/* 🎨 ANIMATIONS */}
      <style>{`
        .teddy-brown {
          font-size: 40px;
          position: absolute;
          left: -60px;
          top: 10px;
          animation: runRight 6s linear infinite;
          filter: sepia(0.7) saturate(1.5);
        }

        .teddy-cream {
          font-size: 40px;
          position: absolute;
          right: -60px;
          top: 10px;
          animation: runLeft 6s linear infinite;
          filter: brightness(1.3) sepia(0.2);
        }

        @keyframes runRight {
          0% { left: -60px; transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(15deg); }
          100% { left: 110%; transform: scale(0.9) rotate(-15deg); }
        }

        @keyframes runLeft {
          0% { right: -60px; transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(-15deg); }
          100% { right: 110%; transform: scale(0.9) rotate(15deg); }
        }

        /* 🤖 AI TEDDY STYLES */
        .ai-teddy-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
        }

        .ai-teddy {
          font-size: 45px;
          cursor: pointer;
          animation: float 3s ease-in-out infinite;
          user-select: none;
        }

        .ai-bubble {
          background: #0f172a;
          border: 1px solid #38bdf8;
          padding: 10px;
          border-radius: 12px;
          margin-bottom: 10px;
          width: 200px;
          font-size: 12px;
          color: white;
          box-shadow: 0 0 15px rgba(56,189,248,0.4);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

    </div>
  );
}

export default Dashboard;