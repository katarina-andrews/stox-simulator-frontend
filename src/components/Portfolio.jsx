import { useEffect, useState } from "react";
import { authorizedApi } from "../api";
import { useAuth } from "react-oidc-context";

export default function Portfolio({ portfolio, setPortfolio, stocks }) {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    setLoading(true);

    const api = authorizedApi(auth.user.access_token);
    api
      .get("/portfolio")
      .then((res) => {
        console.log("Portfolio response:", res);
        setPortfolio(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading portfolio...</p>;

  const getStockPrice = (symbol) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    return stock ? stock.price : 0;
  };

  const getChangePercent = (symbol) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    return stock ? stock.changePercent : 0;
  };

  return (
    <section className="">
      <p className="text-lg font-bold mb-4">
        Cash: ${portfolio.cashBalance?.toFixed(2) ?? "0.00"}
      </p>

      <h3 className="font-semibold my-4 text-xl">Holdings</h3>

      {Object.keys(portfolio.holdings || {}).length === 0 && (
        <p className="text-gray-500">No holdings yet.</p>
      )}

      <div className="flex gap-4 overflow-x-auto pb-3">
        {Object.entries(portfolio.holdings || {}).map(([ticker, qty]) => {
          const price = getStockPrice(ticker);
          const changePercent = getChangePercent(ticker);
          const totalValue = (price * qty).toFixed(2);

          return (
            <div
              key={ticker}
              className="min-w-[200px] flex-shrink-0 bg-white shadow-md rounded-xl p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{ticker}</h3>
                <span
                  className={`text-sm font-medium ${
                    changePercent > 0
                      ? "text-green-600"
                      : changePercent < 0
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  ({changePercent > 0 ? "+" : ""}
                  {changePercent}%)
                </span>
              </div>

              <p className="text-gray-700 text-sm">Shares: {qty}</p>
              <p className="text-gray-700 text-sm">
                Price: ${price.toFixed(2)}
              </p>
              <p className="text-lg font-semibold mt-1">Total: ${totalValue}</p>
              <button className="w-full text-sm bg-red-600 hover:bg-red-700 text-white mt-3 py-1.5 rounded-lg cursor-pointer">
                Sell
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
