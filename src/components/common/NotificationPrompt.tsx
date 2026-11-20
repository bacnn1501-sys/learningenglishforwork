import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationPrompt: React.FC = () => {
  const { userProfile, updateUserProfileState } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default' && !userProfile?.settings?.dailyReminder) {
      // Show prompt after a slight delay
      const timer = setTimeout(() => {
        setVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userProfile]);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('F&B English Hub', {
          body: 'Tuyệt vời! Chúng tôi sẽ nhắc bạn luyện tập tiếng Anh 15 phút mỗi ngày.',
          icon: '/pwa-192x192.png'
        });
        await updateUserProfileState({
          settings: {
            ...userProfile?.settings,
            darkMode: userProfile?.settings?.darkMode ?? false,
            fontSize: userProfile?.settings?.fontSize ?? 'md',
            dailyReminder: true,
            reminderTime: '14:00'
          }
        });
      }
    } catch (e) {
      console.warn('Notification permission error:', e);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cài đặt thông báo"
      className="fixed bottom-20 right-4 z-40 max-w-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-xl animate-bounce-subtle"
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 flex-shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Duy trì thói quen học tập</h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Bật thông báo nhẹ nhàng để không bỏ lỡ Streak 15 phút giữa ca làm việc nhé!
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={requestPermission}
              className="px-2.5 py-1 text-[11px] font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:scale-95 transition-all"
            >
              Bật nhắc nhở
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

