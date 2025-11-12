import { useEffect, useState } from "react";
import { api } from "../api";

export default function Portfolio({ portfolio, setPortfolio }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    api.get("/portfolio")
        .then((response) => {
          console.log(response);
          setPortfolio(response.data);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading portfolio...</p>;

  return (
    <div className="">
      <p className="text-xl font-bold">
        Cash: ${portfolio.cashBalance?.toFixed(2)}
      </p>

      <h3 className="font-semibold mt-4">Holdings</h3>
      {Object.keys(portfolio.holdings || {}).length === 0 && (
        <p>No holdings yet.</p>
      )}

      {Object.entries(portfolio.holdings || {}).map(([ticker, qty]) => (
        <div key={ticker} className="flex justify-between mt-2">
          <p>
            {ticker}: {qty} shares
          </p>
          <button className="bg-red-500 text-white px-3 py-1 rounded">
            Sell
          </button>
        </div>
      ))}
    </div>
  );
}
