import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Pricing() {

  const [selected, setSelected] = useState("Pro");

  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Basic access for beginners",
      features: ["Chat AI", "Limited requests"]
    },
    {
      name: "Pro",
      price: "$19",
      desc: "Best for developers",
      features: ["Unlimited chat", "Code review", "Analytics"]
    },
    {
      name: "Enterprise",
      price: "$99",
      desc: "For teams & companies",
      features: ["Team dashboard", "API access", "Priority support"]
    }
  ];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <Navbar />

      <h1 className="text-5xl font-bold mb-10 mt-10">
        💎 Pricing Plans
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {plans.map((plan, index) => (

          <div
            key={index}
            className={`p-8 rounded-3xl shadow-lg border-2 transition ${
              selected === plan.name
                ? "border-cyan-400 bg-slate-800"
                : "border-slate-700 bg-slate-900"
            }`}
          >

            <h2 className="text-3xl font-bold mb-2">
              {plan.name}
            </h2>

            <p className="text-2xl mb-2">
              {plan.price}/month
            </p>

            <p className="text-slate-400 mb-4">
              {plan.desc}
            </p>

            <ul className="space-y-2 text-sm mb-6">
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              onClick={() => setSelected(plan.name)}
              className={`w-full py-2 rounded-xl font-bold ${
                selected === plan.name
                  ? "bg-green-500"
                  : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              {selected === plan.name ? "Selected" : "Choose Plan"}
            </button>

          </div>

        ))}

      </div>
    </div>
  );
}