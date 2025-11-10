import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_qND49wykO",
  client_id: "4cd1t6k5jgtrn9v8ch0hgpnq4e",
  redirect_uri: import.meta.env["VITE_LOCAL_URL"],
  response_type: "code",
  scope: "email openid phone",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // Crucial in an SPA without routes: remove ?code&state after processing
  onSigninCallback() {
    // strip query/hash so a refresh won't try to handle the callback again
    window.history.replaceState({}, document.title, "/");
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
