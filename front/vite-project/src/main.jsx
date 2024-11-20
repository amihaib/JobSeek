import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <script
      src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"
      crossOrigin="true"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
      crossOrigin="true"
    ></script>
    <Provider store={store}>
      <App />
    </Provider>
  </>
  // </StrictMode>
);
