import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ContentProvider } from "./content-context";
import "./styles.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("No se encontró el elemento raíz de la aplicación.");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>,
);
