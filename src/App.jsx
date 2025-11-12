import { useState } from "react";
import "./App.css";
import { useAuth } from "react-oidc-context";
import StocksList from "./components/StocksList";
import Portfolio from "./components/Portfolio";

function App() {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState({});

  const auth = useAuth();
  const username = auth.user?.profile["cognito:username"];

  const Error = () => {
    if (auth.error) {
      return <div>Encountering error... {auth.error.message}</div>;
    }
  };

  const Badge = () => {
    if (auth.isAuthenticated) {
      return (
        <div className="flex justify-between align-baseline">
          <pre> Hello, {username} </pre>

          <button
            className="bg-blue-500 text-white px-3 py-1 rounded m-2"
            onClick={() => auth.removeUser()}
          >
            Sign out
          </button>
        </div>
      );
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <>
        <header className="mb-5 text-left h-48">
          <h1 className="m-5 text-3xl text-center">Stox Simulator</h1>
          <button onClick={() => auth.signinRedirect()}>Sign in</button>
          <Error />
        </header>
        <main>
          <p className="text-center text-gray-500 mt-5">
            Please log in to view your stocks and portfolio.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="mb-5 text-left h-48">
        <h1 className="m-5 text-3xl text-center">Stox Simulator</h1>
        <Badge />
      </header>

      <main>
        <section id="stocks">
          <h2 className="text-2xl font-bold mb-4">Stocks</h2>
          <StocksList stocks={stocks} setStocks={setStocks} />
        </section>

        <section id="portfolio">
          <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
          <button className="bg-green-500 text-white px-3 py-1 rounded">
            Add Cash
          </button>
          <Portfolio portfolio={portfolio} setPortfolio={setPortfolio} />
        </section>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
