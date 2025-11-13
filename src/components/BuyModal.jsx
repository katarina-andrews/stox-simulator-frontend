import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { authorizedApi } from "../api";

export default function BuyModal({ stock, close, refreshPortfolio }) {
  const auth = useAuth();
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, []);

  const submitBuy = (e) => {
    e.preventDefault();
    if (!auth.user?.access_token) {
      setError("You must be logged in to make a purchase.");
      return;
    }

    const authorized = authorizedApi(auth.user.access_token);
    setLoading(true);

    authorized
      .post("/buy", {
        ticker: stock.symbol,
        quantity,
      })
      .then((res) => {
        console.log("Buy successful:", res.data);
        refreshPortfolio();
        close();
      })
      .catch((err) => {
        console.error(err);
        setError(
          err.response?.data?.error || "Failed to buy stock. Try again."
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">
          Buy {stock?.name} ({stock?.symbol})
        </h2>

        <form onSubmit={submitBuy}>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="border p-2 rounded w-full mb-3"
            required
          />

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              {loading ? "Buying..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={close}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
