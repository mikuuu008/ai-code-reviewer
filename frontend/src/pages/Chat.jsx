import { useState } from "react";


export default function Chat() {

  const [messages, setMessages] = useState([
    { role: "ai", text: "👋 Hi! I’m your AI assistant. Ask me anything about coding." }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {

  if (!input.trim()) return;

  const userMessage = { role: "user", text: input };
  setMessages(prev => [...prev, userMessage]);

  const currentInput = input;
  setInput("");
  setLoading(true);

  try {

    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: currentInput,
        // default chat mode
      })
    });

    const data = await response.json();

    const aiMessage = {
      role: "ai",
      text: data.reply 
    };

    setMessages(prev => [...prev, aiMessage]);

  } catch (error) {

    setMessages(prev => [...prev, {
      role: "ai",
      text: "❌ Backend not reachable"
    }]);

  } finally {
    setLoading(false);
  }
};
  return (

    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex flex-col">

      

      {/* TITLE */}
      <div className="p-6">
        <h1 className="text-4xl font-bold mt-6">
          💬 AI Chat Assistant
        </h1>
        <p className="text-slate-400">
          Ask questions, get answers instantly ✨
        </p>
      </div>

      {/* CHAT BOX */}
      <div className="flex-1 px-6 overflow-y-auto space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl p-4 rounded-2xl ${
              msg.role === "user"
                ? "ml-auto bg-green-600 text-white"
                : "mr-auto bg-slate-800 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-slate-400 italic">
            🤖 AI is typing...
          </div>
        )}

      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-xl bg-slate-800 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-bold"
        >
          Send
        </button>

      </div>

    </div>
  );
}