// main.jsx - REMOVE StrictMode
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { CartProvider } from "./context/cartcontext.jsx";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);