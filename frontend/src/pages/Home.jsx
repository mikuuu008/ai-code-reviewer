import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">

        <h1 className="text-5xl font-bold text-cyan-400">
          🚀 AI Code Reviewer SaaS
        </h1>

        <p className="mt-6 text-xl text-slate-300 max-w-2xl">
          Smart AI-powered platform that reviews code, runs bots, and gives
          instant feedback like a professional software engineer.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-cyan-500 px-6 py-3 rounded-xl hover:bg-cyan-600"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="bg-slate-800 px-6 py-3 rounded-xl border border-cyan-500 hover:bg-slate-700"
          >
            Admin Panel
          </button>

        </div>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6 mt-20 px-10">

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:scale-105 transition">

          <h2 className="text-xl font-bold text-cyan-400">
            🤖 AI Code Review
          </h2>

          <p className="text-slate-400 mt-2">
            Automatically analyze and improve your code using AI.
          </p>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:scale-105 transition">

          <h2 className="text-xl font-bold text-green-400">
            ⚡ Bot System
          </h2>

          <p className="text-slate-400 mt-2">
            Run multiple AI bots for Python, JS, Java, and more.
          </p>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:scale-105 transition">

          <h2 className="text-xl font-bold text-purple-400">
            🔐 Secure Platform
          </h2>

          <p className="text-slate-400 mt-2">
            Authentication + safe execution environment.
          </p>

        </div>

      </div>

    </div>
  );
}