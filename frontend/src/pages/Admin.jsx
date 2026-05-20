import { useState } from "react";

export default function Admin() {
  const [bots] = useState([
    { name: "🐍 Python Bot" },
    { name: "⚡ JavaScript Bot" },
    { name: "☕ Java Bot" },
    { name: "💻 C Bot" },
    { name: "🔐 Security Bot" },
  ]);

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= RUN BOT =================
  const runBot = async (botName) => {
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/run-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bot_name: botName,
          message: "Explain something useful in coding",
        }),
      });

      const data = await res.json();
      setOutput(data.output);

    } catch (error) {
      setOutput("❌ Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        🛠 AI Admin Panel
      </h1>

      {/* OUTPUT */}
      {output && (
        <div className="bg-slate-800 p-4 rounded mb-6 border border-cyan-500">
          <h2 className="text-green-400 font-bold mb-2">Bot Response:</h2>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {/* BOT LIST */}
      <div className="space-y-4">

        {bots.map((bot, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-slate-800 p-4 rounded-xl"
          >
            <span>{bot.name}</span>

            <button
              onClick={() => runBot(bot.name)}
              className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600"
            >
              {loading ? "Running..." : "Run Bot"}
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}