import { useState, useEffect } from "react";
import { authorizedApi } from "../api";
import { useAuth } from "react-oidc-context";

export default function AddCashModal({ close, refreshPortfolio }) {
  const auth = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, []);

  const submitAddCash = (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!auth.isAuthenticated) {
      setError("You must be logged in to add cash.");
      setLoading(false);
      return;
    }

    const api = authorizedApi(auth.user.access_token);

    api
      .post("/add-cash", { amount: parseFloat(amount) })
      .then((res) => {
        console.log("Added cash:", res.data);
        refreshPortfolio();
        close();
      })
      .catch((err) => {
        console.error("Error adding cash:", err);
        setError(err.response?.data?.error || "Failed to add cash. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="modal-div-1">
      <div className="modal-div-2">
        <h2 className="text-xl font-bold mb-4">Add Cash</h2>

        <form onSubmit={submitAddCash}>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="border p-2 rounded w-full mb-3"
            required
          />

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2 cursor-pointer"
            >
              {loading ? "Adding..." : "Confirm"}
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
