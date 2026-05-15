import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {

  return (

    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-950 p-6">

        <h1 className="text-3xl font-bold mb-10">
          💻 My Code Hero
        </h1>

        <div className="flex flex-col gap-5 text-lg">

          <Link to="/">🚀 Dashboard</Link>

          <Link to="/chat">💬 AI Chat</Link>

          <Link to="/history">📚 History</Link>

          <Link to="/analytics">📈 Analytics</Link>

          <Link to="/pricing">💎 Pricing</Link>

          <Link to="/settings">⚙️ Settings</Link>

        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

        <Outlet />

      </div>

    </div>

  );
}