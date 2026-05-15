import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 p-6 border-r border-slate-800">

      <h1 className="text-2xl font-bold text-cyan-400 mb-10">
        ⚡ My Code Hero
      </h1>

      <div className="flex flex-col gap-4">

        <Link
          to="/"
          className="bg-slate-800 hover:bg-cyan-500 p-3 rounded-xl"
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/history"
          className="bg-slate-800 hover:bg-cyan-500 p-3 rounded-xl"
        >
          📚 History
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;