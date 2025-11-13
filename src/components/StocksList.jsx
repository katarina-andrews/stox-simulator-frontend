import { useEffect, useState } from "react";
import { api } from "../api";

export default function StocksList({ stocks, setStocks }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    api
      .get("/stocks")
      .then(function (res) {
        // handle success
        console.log(res);
        setStocks(res.data);
        setError("");
      })
      .catch(function (err) {
        // handle error
        console.log(err);
        setError(
          err.response?.data?.message ||
            (err.response?.status === 429
              ? "Too many requests. Please try again later."
              : "An unexpected error occurred")
        );
      })
      .finally(function () {
        // always executed
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading stocks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stocks.length) return <p>No stocks found.</p>;
  return (
    <section className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Available Stocks</h2>

      <div className="flex gap-4 overflow-x-auto pb-3">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="min-w-[200px] flex-shrink-0 bg-white shadow-md rounded-xl p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{stock.symbol}</h3>
              <span
                className={`text-sm font-medium ${
                  stock.changePercent > 0
                    ? "text-green-600"
                    : stock.changePercent < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {stock.changePercent > 0 ? "+" : ""}
                {stock.changePercent}%
              </span>
            </div>

            <p className="text-gray-700 text-sm">{stock.name}</p>
            <p className="text-lg font-semibold mt-1">${stock.price}</p>
            <button className="mt-3 w-full py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer">
              Buy
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
