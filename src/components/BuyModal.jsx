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

  const submitBuy = (event) => {
    event.preventDefault();

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
    <div className="modal-div-1">
      <div className="modal-div-2">
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
              className="bg-blue-600 hover:bg-blue-700  text-white px-4 py-2 rounded mr-2 cursor-pointer"
            >
              {loading ? "Buying..." : "Confirm"}
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
