import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Subscription() {

  const [currentPlan, setCurrentPlan] = useState("Free");

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["Basic AI chat", "Limited requests"],
      color: "bg-slate-800"
    },
    {
      name: "Pro",
      price: "$19",
      features: ["Unlimited chat", "Code review", "Priority AI"],
      color: "bg-blue-600"
    },
    {
      name: "Enterprise",
      price: "$99",
      features: ["Team access", "Advanced analytics", "API access"],
      color: "bg-purple-600"
    }
  ];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <Navbar />

      <h1 className="text-5xl font-bold mt-10 mb-6">
        💎 Subscription
      </h1>

      <p className="text-slate-400 mb-8">
        Manage your plan and upgrade anytime
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        {plans.map((plan, index) => (

          <div key={index} className={`${plan.color} p-8 rounded-3xl shadow-lg`}>

            <h2 className="text-3xl font-bold mb-3">
              {plan.name}
            </h2>

            <p className="text-2xl mb-4">
              {plan.price}/month
            </p>

            <ul className="text-sm space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              onClick={() => setCurrentPlan(plan.name)}
              className={`px-5 py-2 rounded-xl font-bold ${
                currentPlan === plan.name
                  ? "bg-green-500"
                  : "bg-white text-black"
              }`}
            >
              {currentPlan === plan.name ? "Current Plan" : "Select"}
            </button>

          </div>

        ))}

      </div>
    </div>
  );
}