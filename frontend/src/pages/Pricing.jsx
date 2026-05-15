export default function Pricing(){

  return(

    <div>

      <h1 className="text-5xl font-bold mb-10">
        💎 Pricing
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-slate-900 p-8 rounded-3xl">

          <h2 className="text-3xl mb-5">
            Free
          </h2>

          <p>$0/month</p>

        </div>

        <div className="bg-blue-600 p-8 rounded-3xl">

          <h2 className="text-3xl mb-5">
            Pro
          </h2>

          <p>$19/month</p>

        </div>

        <div className="bg-slate-900 p-8 rounded-3xl">

          <h2 className="text-3xl mb-5">
            Enterprise
          </h2>

          <p>$99/month</p>

        </div>

      </div>

    </div>

  );
}