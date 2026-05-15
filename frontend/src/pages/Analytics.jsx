export default function Analytics(){

  return(

    <div>

      <h1 className="text-5xl font-bold mb-8">
        📈 Analytics
      </h1>

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-slate-900 p-8 rounded-2xl">
          Total Reviews: 120
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">
          Saved Snippets: 15
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">
          AI Requests: 320
        </div>

      </div>

    </div>

  );
}