import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { authorizedApi } from "../api";

export default function TransactionsModal({ close }) {
  const auth = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTransactions = (pageNum = 1) => {
    if (!auth.isAuthenticated || !auth.user?.access_token) return;

    setLoading(true);
    const api = authorizedApi(auth.user.access_token);

    api
      .get(`/transactions?page=${pageNum}`)
      .then((res) => {
        setTransactions(res.data.transactions);
        setPage(res.data.page);
        setTotal(res.data.total);
        setError("");
      })
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load transactions")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page, auth.user]);

  const totalPages = Math.ceil(total / 10);

  if (loading)
    return (
      <div className="modal-div-1">
        <div className="modal-div-2">
          <p>Loading transactions...</p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Transactions</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="bg-white shadow rounded-lg p-3 border border-gray-200"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{tx.type.toUpperCase()}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(tx.date).toLocaleString()}
                  </span>
                </div>
                {tx.ticker && (
                  <p className="text-gray-700">
                    {tx.ticker}: {tx.quantity} shares @ ${tx.price?.toFixed(2)}{" "}
                    each
                  </p>
                )}
                {tx.amount && (
                  <p className="text-gray-700">Amount: ${tx.amount}</p>
                )}
                {tx.total && (
                  <p className="text-gray-700">Total: ${tx.total.toFixed(2)}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={close} className="cancel-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
