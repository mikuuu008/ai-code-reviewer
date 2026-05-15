function History() {
  const snippets =
    JSON.parse(localStorage.getItem("snippets")) || [];

  return (
    <div>

      <h1 className="text-4xl font-bold mb-6">
        📚 Saved History
      </h1>

      <div className="space-y-4">

        {snippets.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900 p-4 rounded-xl"
          >
            <p className="text-cyan-400 mb-2">
              {item.date}
            </p>

            <pre className="text-sm overflow-auto">
              {item.code}
            </pre>
          </div>
        ))}

      </div>

    </div>
  );
}

export default History;