import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { authorizedApi } from "../api";

export default function SellModal({ stock, close, refreshPortfolio }) {
  const auth = useAuth();
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, []);

  const submitSell = (event) => {
    event.preventDefault();

    const authorized = authorizedApi(auth.user.access_token);
    setLoading(true);

    console.log("Selling stock:", stock, "Quantity:", quantity);

    authorized
      .post("/sell", {
        ticker: stock.ticker,
        quantity,
      })
      .then((res) => {
        console.log("Sell successful:", res.data);
        refreshPortfolio();
        close();
      })
      .catch((err) => {
        console.error(err);
        setError(
          err.response?.data?.error || "Failed to sell stock. Try again."
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="modal-div-1">
      <div className="modal-div-2">
        <h2 className="text-xl font-bold mb-4">
          Sell {stock?.ticker} ({stock?.qty} shares owned)
        </h2>

        <form onSubmit={submitSell}>
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2 cursor-pointer"
            >
              {loading ? "Selling..." : "Confirm"}
            </button>
            <button type="button" onClick={close} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
