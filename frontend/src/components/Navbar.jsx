import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 p-4 flex gap-4 text-white">

      <Link to="/">Home</Link>

      <Link to="/dashboard">Dashboard</Link>

      <Link to="/chat">Chat</Link>
      
      <Link to="/admin">Admin </Link>
      <Link to="/upgrade">Upgrade</Link>

      <Link to="/analytics">Analytics</Link>

      <Link to="/history">History</Link>

      <Link to="/pricing">Pricing</Link>

      <Link to="/settings">Settings</Link>

      

      <Link to="/login">Login</Link>

      {/* ✅ FIXED HERE */}
      <Link to="/register">Register</Link>

    </nav>
  );
}

export default Navbar;  