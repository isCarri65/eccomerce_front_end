import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "simplebar-react/dist/simplebar.min.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
