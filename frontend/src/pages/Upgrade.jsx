
import { useLocation } from "react-router-dom";

export default function Upgrade() {

  const location = useLocation();

  // ✅ SAFE fallback (prevents undefined issues)
  const selectedPlan =
    location?.state?.plan
      ? location.state.plan
      : "Pro";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

     

      <div className="max-w-3xl mx-auto mt-16 bg-slate-900 p-10 rounded-3xl border border-slate-700 shadow-2xl">

        <h1 className="text-5xl font-bold mb-6 text-center">
          🚀 Upgrade Plan
        </h1>

        <div className="bg-slate-800 p-6 rounded-2xl mb-8">

          <h2 className="text-3xl font-bold text-cyan-400 mb-2">
            {selectedPlan} Plan
          </h2>

          <p className="text-slate-300">
            You selected the {selectedPlan} plan.
          </p>

        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Card Holder Name"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none"
          />

          <input
            type="text"
            placeholder="Card Number"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="MM/YY"
              className="p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none"
            />

            <input
              type="text"
              placeholder="CVV"
              className="p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none"
            />

          </div>

          <button className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold text-lg transition">
            Pay Now 💳
          </button>

        </div>

      </div>

    </div>
  );
}