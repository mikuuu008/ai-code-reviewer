import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

export default function Settings() {

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // ================= LOAD THEME =================
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");

    if (saved !== null) {
      setDarkMode(saved === "true");
    }
  }, []);

  // ================= APPLY THEME =================
  useEffect(() => {

    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#020617";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc";
    }

    localStorage.setItem("darkMode", darkMode);

  }, [darkMode]);

  // ================= FETCH SETTINGS =================
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {

      const res = await fetch(`${BASE_URL}/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setDarkMode(Boolean(data.dark_mode));
      setApiKey(data.api_key || "");
      setUsername(data.username || "");
      setEmailNotifications(Boolean(data.email_notifications));

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // ================= SAVE =================
  const saveSettings = async () => {

    setSaving(true);

    try {

      await fetch(`${BASE_URL}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dark_mode: darkMode,
          api_key: apiKey,
          username,
          email_notifications: emailNotifications,
        }),
      });

      alert("✅ Settings saved!");

    } catch (err) {

      console.log(err);
      alert("❌ Save failed");

    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-5xl font-bold mb-8 mt-10">
        ⚙️ Settings
      </h1>

      {loading ? (
        <p className="text-slate-400">
          Loading settings...
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {/* DARK MODE */}
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">
              🌙 Dark Mode
            </h2>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`px-4 py-2 rounded-xl font-bold ${
                darkMode ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              {darkMode ? "ON" : "OFF"}
            </button>
          </div>

          {/* USERNAME */}
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">
              👤 Username
            </h2>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl"
              placeholder="Enter username"
            />
          </div>

          {/* API */}
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">
              🔐 API Key
            </h2>

            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl"
              placeholder="Enter API Key"
            />
          </div>

          {/* EMAIL */}
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">
              📧 Email Notifications
            </h2>

            <button
              onClick={() => setEmailNotifications((prev) => !prev)}
              className={`px-4 py-2 rounded-xl font-bold ${
                emailNotifications ? "bg-cyan-500" : "bg-gray-500"
              }`}
            >
              {emailNotifications ? "ON" : "OFF"}
            </button>
          </div>

          {/* VIEW HISTORY */}
          <div className="md:col-span-2">
            <button
              onClick={() => navigate("/history")}
              className="bg-cyan-500 px-6 py-3 rounded-xl font-bold w-full mb-4"
            >
              📜 View History
            </button>
          </div>

          {/* SAVE */}
          <div className="md:col-span-2">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-green-500 px-6 py-3 rounded-xl font-bold w-full"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}