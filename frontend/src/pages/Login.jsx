import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "❌ Invalid login");
        return;
      }

      localStorage.setItem("token", data.token);

      setMessage("✅ Login successful");

      navigate("/history");

    } catch (err) {
      console.log(err);
      setMessage("❌ Backend server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#ddd6fe] to-[#bfdbfe] flex justify-center items-center px-4 relative">

      {/* ================= AMAZING CAT ROBOT ================= */}

      <div
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 cursor-pointer group z-50"
      >

        <div className="relative animate-bounce">

          {/* Tail */}
          <div className="absolute -right-5 top-10 w-8 h-2 bg-pink-400 rounded-full rotate-45 group-hover:animate-spin"></div>

          {/* Cat Robot */}
          <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-cyan-400 hover:scale-110 transition duration-300">

            <div className="relative">

              <div className="text-5xl">
                🤖🐱
              </div>

              {/* Eyes */}
              <div className="absolute top-4 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute top-4 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>

            </div>

          </div>

        </div>

        <p className="text-black font-bold mt-2 text-center">
          AI Cat
        </p>

      </div>

      {/* ================= LOGIN FORM ================= */}

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/50 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
      >

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">

          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">

            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              alt="logo"
              className="w-16"
            />

          </div>

          <h1 className="text-3xl font-bold mt-4 text-black">
            AI Code Reviewer
          </h1>

          <p className="text-gray-700 mt-2">
            Welcome Back
          </p>

        </div>

        {/* Email */}
        <div className="mb-4">

          <label className="block mb-2 font-medium text-black">
            E-mail
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border border-gray-200 outline-none focus:border-pink-400 text-black"
          />

        </div>

        {/* Password */}
        <div className="mb-5">

          <label className="block mb-2 font-medium text-black">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border border-gray-200 outline-none focus:border-pink-400 text-black"
          />

        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 text-center text-sm font-medium text-black">
            {message}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-400 hover:bg-pink-500 text-black font-bold py-4 rounded-2xl transition duration-300"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Register Link */}
        <p className="text-center mt-6 text-black">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="underline font-semibold"
          >
            Sign Up
          </Link>

        </p>

      </form>

    </div>
  );
}