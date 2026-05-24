import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

export default function Register() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    setMessage("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("⚠️ Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(`${BASE_URL}/register`, {
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
        setMessage(data.detail || "❌ Registration failed");
        return;
      }

      setMessage("✅ Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMessage("❌ Backend server not running");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#ddd6fe] to-[#bfdbfe] flex justify-center items-center px-4">

      <form
        onSubmit={handleRegister}
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
            Create Account
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
        <div className="mb-4">

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

        {/* Confirm Password */}
        <div className="mb-5">

          <label className="block mb-2 font-medium text-black">
            Re-enter Password
          </label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-center mt-6 text-black">

          Already have an account?{" "}

          <Link
            to="/login"
            className="underline font-semibold"
          >
            Sign In
          </Link>

        </p>

      </form>

    </div>
  );
}