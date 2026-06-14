import { useEffect, useState } from "react";
import { installPWA, checkInstallable, forceInstallCheck } from "@/utils/pwa";

export default function PWAInstallModal() {
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallation = () => {
      const installed = forceInstallCheck();
      setIsInstalled(installed);
      
      if (!installed && checkInstallable()) {
        setShowModal(true);
      }
    };

    checkInstallation();
    
    // Check periodically
    const interval = setInterval(checkInstallation, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    const installed = await installPWA();
    if (installed) {
      setIsInstalled(true);
      setShowModal(false);
    }
  };

  if (isInstalled || !showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
      <div className="bg-[#131316] border border-white/[0.1] rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Installation requise</h2>
        <p className="text-[#a1a1aa] text-sm mb-6 leading-relaxed">
          Pour accéder à l'application SM Platform, vous devez l'installer sur votre appareil.
        </p>
        <button
          onClick={handleInstall}
          className="w-full bg-white text-[#0a0a0c] py-3 rounded-xl font-semibold hover:bg-[#e8e8e8] transition-colors"
        >
          Installer l'application
        </button>
      </div>
    </div>
  );
}
