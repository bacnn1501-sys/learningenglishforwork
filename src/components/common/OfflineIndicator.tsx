import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-auto px-4 py-2 rounded-full shadow-lg text-xs font-medium transition-all"
    >
      {!isOnline ? (
        <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Bạn đang ngoại tuyến. Dữ liệu đã lưu vẫn sẵn sàng học!</span>
        </div>
      ) : (
        <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
          <CheckCircle className="w-4 h-4" />
          <span>Đã kết nối lại internet!</span>
        </div>
      )}
    </aside>
  );
};

