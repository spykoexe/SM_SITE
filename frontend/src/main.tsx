import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// import { registerSW, setupInstallPrompt, forceInstallCheck } from "./utils/pwa";

document.documentElement.classList.add("dark");
document.body.classList.add("dark");

// Initialize PWA
// registerSW();
// setupInstallPrompt();

// Check if app is installed
// const isInstalled = forceInstallCheck();
// if (!isInstalled) {
//   // App is not installed - could show modal or redirect
//   console.log("PWA not installed");
// }

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);