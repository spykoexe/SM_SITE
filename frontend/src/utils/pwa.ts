// PWA Installation Logic - Hidden from public view
// This file contains the PWA installation logic that is not exposed in the UI

let deferredPrompt: any = null;

export const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("SW registered: ", registration);
        },
        (registrationError) => {
          console.log("SW registration failed: ", registrationError);
        }
      );
    });
  }
};

export const setupInstallPrompt = () => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
};

export const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === "accepted";
  }
  return false;
};

export const checkInstallable = () => {
  return deferredPrompt !== null;
};

// Force installation check on app load
export const forceInstallCheck = () => {
  // Check if app is already installed
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }
  return false;
};
