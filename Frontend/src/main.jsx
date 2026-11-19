
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import store from "./redux/store.js";
import AuthInitializer from "./Components/AuthInitializer.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </Provider>
</React.StrictMode>
);
