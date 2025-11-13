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
  }, [auth.isAuthenticated]);

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
    <div className="">
      <p className="text-xl font-bold">
        Cash: ${portfolio.cashBalance?.toFixed(2) ?? "0.00"}
      </p>

      <h3 className="font-semibold mt-4">Holdings</h3>
      {Object.keys(portfolio.holdings || {}).length === 0 && (
        <p>No holdings yet.</p>
      )}

      {Object.entries(portfolio.holdings || {}).map(([ticker, qty]) => {
        const price = getStockPrice(ticker);
        const changePercent = getChangePercent(ticker);
        const totalValue = (price * qty).toFixed(2);

        return (
          <div key={ticker} className="flex justify-between mt-2">
            <div>
              <p>
                {ticker}: {qty} shares
              </p>
              <p className="text-gray-500 text-sm">
                Total: ${totalValue}{" "}
                <span
                  className={`${
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
              </p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer">
              Sell
            </button>
          </div>
        );
      })}
    </div>
  );
}
