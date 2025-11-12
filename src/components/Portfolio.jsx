import { useEffect, useState } from "react";
import { authorizedApi } from "../api";
import { useAuth } from "react-oidc-context";

export default function Portfolio({ portfolio, setPortfolio }) {
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

  return (
    <div className="">
      <p className="text-xl font-bold">
        Cash: ${portfolio.cashBalance?.toFixed(2) ?? "0.00"}
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
