import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";

interface AnnouncementToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function AnnouncementToast({ message, duration = 10000, onClose }: AnnouncementToastProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    const timeout = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[10000] animate-fade-in">
      <div className="relative bg-[#131316] border border-white/[0.1] rounded-2xl px-6 py-4 shadow-2xl max-w-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60 hover:text-white" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
          <div
            className="h-full bg-white/60 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
