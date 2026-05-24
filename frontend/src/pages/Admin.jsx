import { useState, useEffect } from "react";

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

  // ================= GAME STATES =================
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [quiz, setQuiz] = useState(null);

  const [timer, setTimer] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [typingInput, setTypingInput] = useState("");
  const [memoryInput, setMemoryInput] = useState("");

  // ================= ROBOT VISIBILITY =================
  const [robotVisible, setRobotVisible] = useState(true);
  const [catMove, setCatMove] = useState(false);

  // ================= GAME MODE =================
  const [game, setGame] = useState(null);

  // ================= AI CHAT =================
  const [chatOpen, setChatOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState("");

  // ================= TIMER =================
  useEffect(() => {
  let interval = null;

  if (timerRunning) {
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [timerRunning]);

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

      if (data.output) {
        setOutput(data.output);
      } else {
        setOutput("❌ Bot error");
      }

    } catch (error) {

      setOutput("❌ Error: " + error.message);

    }

    setLoading(false);
  };

  // ================= START GAME =================
  const startGame = async (name) => {

    setGame(name);

    setAnswer("");
    setTypingInput("");
    setMemoryInput("");

    setTimer(60);
    setTimerRunning(true);

    try {

      const res = await fetch(`http://127.0.0.1:8000/game/${name}`);
      const data = await res.json();

      setQuiz(data);

    } catch (err) {

      console.log(err);

    }
  };

  // ================= STOP TIMER =================
  const stopTimer = () => {
  setTimerRunning(false);
};

  // ================= RESET TIMER =================
  const resetTimer = () => {
    setTimer(60);
    setTimerRunning(false);
  };

  // ================= PYTHON QUIZ =================
  const submitPython = () => {

    if (!quiz) return;

    if (answer.toLowerCase() === quiz.a.toLowerCase()) {

      alert("✅ Correct!");
      setScore(score + 10);

    } else {

      alert("❌ Wrong!");

    }

    startGame("python");
  };

  // ================= JAVA GAME =================
  const submitJava = () => {

    if (typingInput.length > 20) {

      alert("☕ Java Challenge Complete!");
      setScore(score + 20);

    } else {

      alert("❌ Write more Java code!");

    }
  };

  // ================= C MEMORY GAME =================
  const submitC = () => {

    const correct = quiz.sequence.join(" ");

    if (memoryInput === correct) {

      alert("🎯 Memory Correct!");
      setScore(score + 15);

    } else {

      alert("❌ Wrong Sequence");
    }
  };

  // ================= C# GAME =================
  const submitCSharp = () => {

    if (typingInput === quiz.text) {

      alert("⌨️ Perfect Typing!");
      setScore(score + 25);

    } else {

      alert("❌ Typing Incorrect");
    }
  };

  // ================= CHAT =================
  const sendChat = async () => {

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
      }),
    });

    const data = await res.json();

    typeWriter(data.reply);
  };

  // ================= TYPE EFFECT =================
  const typeWriter = (text) => {

    setTyping("");

    let i = 0;

    const interval = setInterval(() => {

      setTyping(text.slice(0, i));

      i++;

      if (i > text.length) {

        clearInterval(interval);

      }

    }, 20);
  };

  // ================= VOICE =================
  const speak = (text) => {

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden">

      {/* ================= AI CAT BUTTON ================= */}
      <button
        onClick={() => {
          setRobotVisible(!robotVisible);
          setCatMove(true);

          setTimeout(() => {
            setCatMove(false);
          }, 2000);
        }}
        className={`
          fixed bottom-6 right-6 z-50
          text-6xl
          transition-all duration-1000
          ${catMove ? "translate-x-[500px] -translate-y-20 rotate-12" : ""}
        `}
      >
        🐱
      </button>

      {/* ================= FLOATING AI CAT ================= */}
      {robotVisible && (
        <div className="fixed bottom-24 right-6 z-40 animate-bounce">

          <div className="relative">

            <div className="bg-pink-500 p-5 rounded-full shadow-2xl border-4 border-white text-5xl animate-pulse">
              🤖🐱
            </div>

            {/* TAIL */}
            <div className="absolute -bottom-3 left-10 text-3xl rotate-45 animate-ping">
              🐾
            </div>

          </div>

        </div>
      )}

      {/* ================= TITLE ================= */}
      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        🛠 AI Admin Panel
      </h1>

      {/* ================= GAME PANEL ================= */}
      <div className="bg-slate-900 p-5 rounded-xl mb-8 border border-cyan-500">

        <h2 className="text-xl font-bold mb-3">
          🎮 Mini Coding Games
        </h2>

        {/* TIMER */}
        <div className="flex gap-3 mb-4 items-center">

          <div className="bg-black px-4 py-2 rounded text-yellow-400 font-bold">
            ⏰ {timer}s
          </div>

          <button
            onClick={stopTimer}
            className="bg-red-500 px-3 py-2 rounded"
          >
            Stop Timer
          </button>

          <button
            onClick={resetTimer}
            className="bg-gray-500 px-3 py-2 rounded"
          >
            Reset Timer
          </button>

          <div className="bg-green-700 px-4 py-2 rounded font-bold">
            🏆 Score: {score}
          </div>

        </div>

        {/* GAME BUTTONS */}
        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => startGame("python")}
            className="bg-green-500 px-3 py-2 rounded"
          >
            Python Game
          </button>

          <button
            onClick={() => startGame("java")}
            className="bg-orange-500 px-3 py-2 rounded"
          >
            Java Game
          </button>

          <button
            onClick={() => startGame("c")}
            className="bg-blue-500 px-3 py-2 rounded"
          >
            C Game
          </button>

          <button
            onClick={() => startGame("csharp")}
            className="bg-pink-500 px-3 py-2 rounded"
          >
            C# Game
          </button>

          <button
            onClick={() => setGame(null)}
            className="bg-gray-500 px-3 py-2 rounded"
          >
            Close Game
          </button>

        </div>

        {/* ================= PYTHON GAME ================= */}
        {game === "python" && quiz && (

          <div className="mt-5 bg-slate-800 p-5 rounded-xl">

            <h3 className="text-green-400 font-bold mb-2">
              🐍 Python Quiz
            </h3>

            <p>{quiz.q}</p>

            <input
              className="w-full p-2 text-black mt-3 rounded"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button
              onClick={submitPython}
              className="bg-green-500 px-4 py-2 rounded mt-3"
            >
              Submit
            </button>

          </div>
        )}

        {/* ================= JAVA GAME ================= */}
        {game === "java" && quiz && (

          <div className="mt-5 bg-slate-800 p-5 rounded-xl">

            <h3 className="text-orange-400 font-bold mb-2">
              ☕ Java Coding Challenge
            </h3>

            <p>{quiz.task}</p>

            <textarea
              className="w-full p-2 text-black mt-3 rounded"
              rows="5"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
            />

            <button
              onClick={submitJava}
              className="bg-orange-500 px-4 py-2 rounded mt-3"
            >
              Submit Java Code
            </button>

          </div>
        )}

        {/* ================= C GAME ================= */}
        {game === "c" && quiz && (

          <div className="mt-5 bg-slate-800 p-5 rounded-xl">

            <h3 className="text-blue-400 font-bold mb-2">
              💻 C Memory Game
            </h3>

            <p className="text-yellow-300">
              Remember:
              {" "}
              {quiz.sequence?.join(" ")}
            </p>

            <input
              className="w-full p-2 text-black mt-3 rounded"
              value={memoryInput}
              onChange={(e) => setMemoryInput(e.target.value)}
            />

            <button
              onClick={submitC}
              className="bg-blue-500 px-4 py-2 rounded mt-3"
            >
              Submit Memory
            </button>

          </div>
        )}

        {/* ================= C# GAME ================= */}
        {game === "csharp" && quiz && (

          <div className="mt-5 bg-slate-800 p-5 rounded-xl">

            <h3 className="text-pink-400 font-bold mb-2">
              🎮 C# Typing Test
            </h3>

            <p className="text-cyan-300">
              {quiz.text}
            </p>

            <textarea
              className="w-full p-2 text-black mt-3 rounded"
              rows="4"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
            />

            <button
              onClick={submitCSharp}
              className="bg-pink-500 px-4 py-2 rounded mt-3"
            >
              Submit Typing
            </button>

          </div>
        )}

      </div>

      {/* ================= OUTPUT ================= */}
      {output && (

        <div className="bg-slate-800 p-4 rounded mb-6 border border-cyan-500">

          <h2 className="text-green-400 font-bold mb-2">
            Bot Response:
          </h2>

          <pre className="whitespace-pre-wrap">
            {output}
          </pre>

        </div>
      )}

      {/* ================= BOT LIST ================= */}
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

      {/* ================= CHAT BUTTON ================= */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-24 left-6 bg-cyan-500 p-4 rounded-full text-3xl shadow-2xl animate-bounce"
      >
        🤖
      </button>

      {/* ================= CHAT POPUP ================= */}
      {chatOpen && (

        <div className="fixed bottom-40 left-6 bg-slate-900 p-4 rounded-xl w-80 border border-cyan-500">

          <input
            className="w-full p-2 text-black rounded"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Ask AI..."
          />

          <button
            onClick={sendChat}
            className="bg-green-500 w-full mt-2 py-2 rounded"
          >
            Send
          </button>

          <button
            onClick={() => speak(typing)}
            className="bg-purple-500 w-full mt-2 py-2 rounded"
          >
            🔊 Speak
          </button>

          <p className="mt-3 text-cyan-300 whitespace-pre-wrap">
            {typing}
          </p>

        </div>
      )}

    </div>
  );
}