import { useState } from "react";

function Dashboard() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");

  const handleReview = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setReview(data.review);
    } catch (error) {
      setReview("❌ Backend connection failed");
    }
  };

  const copyReview = () => {
    navigator.clipboard.writeText(review);
    alert("Copied!");
  };

  const saveSnippet = () => {
    const old = JSON.parse(localStorage.getItem("snippets")) || [];

    old.push({
      code,
      review,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem("snippets", JSON.stringify(old));

    alert("Saved!");
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-6">
        💻 AI Code Reviewer
      </h1>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code..."
        className="w-full h-64 bg-slate-900 p-4 rounded-xl border border-cyan-500"
      />

      <button
        onClick={handleReview}
        className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-bold"
      >
        🚀 Review Code
      </button>

      {review && (
        <div className="mt-6 bg-slate-900 p-4 rounded-xl">

          <div className="flex gap-4 mb-4">

            <button
              onClick={copyReview}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              📋 Copy
            </button>

            <button
              onClick={saveSnippet}
              className="bg-purple-500 px-4 py-2 rounded-lg"
            >
              💾 Save
            </button>

          </div>

          <pre className="whitespace-pre-wrap">
            {review}
          </pre>

        </div>
      )}

    </div>
  );
}

export default Dashboard;