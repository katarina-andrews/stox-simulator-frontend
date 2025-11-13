import { useEffect, useState } from "react";
import "./App.css";
import { useAuth } from "react-oidc-context";
import StocksList from "./components/StocksList";
import Portfolio from "./components/Portfolio";
import AddCashModal from "./components/AddCashModal";
import { api, authorizedApi } from "./api";

function App() {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [addCashModalOpen, setAddCashModalOpen] = useState(false);

  const [close, setClose] = useState(false);

  const auth = useAuth();
  const username = auth.user?.profile["cognito:username"];

  const Error = () => {
    if (auth.error) {
      return <div>Encountering error... {auth.error.message}</div>;
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      const authorized = authorizedApi(auth.user.access_token);

      authorized
        .get("/portfolio")
        .then((res) => {
          setPortfolio(res.data);
        })
        .catch((err) => {
          console.error("Error loading portfolio:", err);
        });

      api
        .get("/stocks")
        .then((res) => {
          setStocks(res.data);
        })
        .catch((err) => console.error("Error loading stocks:", err));
    }
  }, [auth.isAuthenticated, auth.user]);

  const refreshPortfolio = () => {
    if (!auth.isAuthenticated || !auth.user?.access_token) return;
    const authorized = authorizedApi(auth.user.access_token);
    authorized
      .get("/portfolio")
      .then((res) => setPortfolio(res.data))
      .catch((err) => console.log(err));
  };

  const Badge = () => {
    if (auth.isAuthenticated) {
      return (
        <div className="flex flex-col justify-center items-center gap-5">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
            onClick={() => auth.removeUser()}
          >
            Sign out
          </button>
          <pre> {username}'s dashboard </pre>
        </div>
      );
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <>
        <header className="mb-5 h-48 flex flex-col justify-center items-center">
          <h1 className="m-5 text-3xl">Stox Simulator</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
            onClick={() => auth.signinRedirect()}
          >
            Sign in
          </button>
          <Error />
        </header>
        <main>
          <p className="text-center text-gray-500 mt-5">
            Please log in to start trading.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="mb-5 text-left h-48 p-10">
        <h1 className="mb-5 text-3xl text-center">Stox Simulator</h1>
        <Badge />
      </header>

      <main>
        <section id="stocks">
          <h2 className="text-2xl font-bold mb-4">Stocks</h2>
          <StocksList
            stocks={stocks}
            setStocks={setStocks}
            refreshPortfolio={refreshPortfolio}
          />
        </section>

        <section id="portfolio">
          <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
          <button
            onClick={() => setAddCashModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer mb-3"
          >
            Add Cash
          </button>
          <Portfolio
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            stocks={stocks}
            refreshPortfolio={refreshPortfolio}
          />
        </section>

        {addCashModalOpen && (
          <AddCashModal
            close={() => setAddCashModalOpen(false)}
            refreshPortfolio={refreshPortfolio}
          />
        )}
      </main>
      <footer></footer>
    </>
  );
}

export default App;
