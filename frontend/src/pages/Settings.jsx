import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Settings() {

  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ================= LOAD SETTINGS =================
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {

    try {
      const res = await fetch("http://127.0.0.1:8000/settings", {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      const data = await res.json();

      setDarkMode(Boolean(data.dark_mode));
      setApiKey(data.api_key || "");

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // ================= SAVE SETTINGS =================
  const saveSettings = async () => {

    await fetch("http://127.0.0.1:8000/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        dark_mode: darkMode,
        api_key: apiKey
      })
    });

    alert("Settings saved!");
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <Navbar />

      <h1 className="text-5xl font-bold mb-8 mt-10">
        ⚙️ SaaS Settings
      </h1>

      {loading ? (
        <p className="text-slate-400">Loading settings...</p>
      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {/* DARK MODE */}
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">🌙 Dark Mode</h2>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-cyan-500 px-4 py-2 rounded-xl"
            >
              {darkMode ? "ON" : "OFF"}
            </button>
          </div>

          {/* API KEY */}
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">🔐 API Key</h2>

            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl"
              placeholder="Enter API Key"
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="md:col-span-2">
            <button
              onClick={saveSettings}
              className="bg-green-500 px-6 py-3 rounded-xl font-bold"
            >
              Save Settings
            </button>
          </div>

        </div>
      )}

    </div>
  );
}