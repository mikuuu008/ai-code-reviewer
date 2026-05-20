import { useState } from "react";
import Navbar from "../components/Navbar";

const BASE_URL = "http://127.0.0.1:8000";

export default function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "❌ Registration failed");
        return;
      }

      setMessage("✅ Account created");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

    } catch (err) {
      setMessage("❌ Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="flex justify-center items-center h-[90vh]">

        <form onSubmit={handleRegister} className="bg-slate-900 p-10 rounded-3xl w-96">

          <h1 className="text-3xl font-bold mb-6">📝 Register</h1>

          <input
            className="w-full p-3 mb-4 rounded-xl text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 mb-4 rounded-xl text-black"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && <p className="text-sm text-cyan-300 mb-3">{message}</p>}

          <button
            disabled={loading}
            className="w-full bg-green-500 p-3 rounded-xl font-bold"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

      </div>
    </div>
  );
}