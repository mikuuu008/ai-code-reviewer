import { useState } from "react";
import Navbar from "../components/Navbar";

const BASE_URL = "http://127.0.0.1:8000";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();
    setMessage("");

    try {

      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      setMessage("✅ Login successful");

    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (

    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="flex justify-center items-center h-[90vh]">

        <form onSubmit={handleLogin} className="bg-slate-900 p-10 rounded-3xl w-96">

          <h1 className="text-3xl font-bold mb-6">🔐 Login</h1>

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

          <button className="w-full bg-red-500 p-3 rounded-xl font-bold">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}