import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Map, BookOpen, Dumbbell, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const tabs = [
    { to: '/dashboard', label: 'Học tập', icon: Sparkles },
    { to: '/roadmap', label: 'Lộ trình', icon: Map },
    { to: '/dictionary', label: 'Từ điển', icon: BookOpen },
    { to: '/practice', label: 'Luyện tập', icon: Dumbbell },
    { to: '/profile', label: 'Hồ sơ', icon: User }
  ];

  return (
    <nav
      aria-label="Điều hướng chính trên di động"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-200/90 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)] transition-colors shadow-lg"
    >
      <div className="grid grid-cols-5 h-14">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 font-bold scale-105'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`
            }
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

