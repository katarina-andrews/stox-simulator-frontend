import React from 'react'
import './App.css'
import { useAuth } from "react-oidc-context";

function App() {
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

          <button onClick={() => auth.removeUser()}>Sign out</button>
        </div>
      );
    }
  };


  return (
    <>
     <header className="mb-5 text-left h-48">
        {!auth.isLoading ? (
          <>
            <h1 className="mb-5">Stox Simulator</h1>

            <Badge />
            {!auth.isAuthenticated && (
              <button onClick={() => auth.signinRedirect()}>Sign in</button>
            )}
            <Error />
          </>
        ) : (
          <p className="text-center h-48">Loading...</p>
        )}
      </header>
      <main>
        <section>
          <h2 className="h2 mb-3 text-left">
            {username ? username + "'s dashboard" : "Login to start trading"}
          </h2>
        </section>
      </main>
      <footer></footer>
    </>
  )
}

export default App
