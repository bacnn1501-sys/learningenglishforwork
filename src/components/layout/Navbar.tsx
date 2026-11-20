import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  Coins,
  Moon,
  Sun,
  Type,
  User as UserIcon,
  ShieldAlert,
  Menu,
  X,
  BookOpen,
  Map,
  Sparkles,
  MessageSquareQuote,
  Utensils
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { currentUser, userProfile, isAdmin, isGuest, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('fb_dark_mode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>(() => {
    return (localStorage.getItem('fb_font_scale') as any) || 'md';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fb_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fb_dark_mode', 'false');
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${fontScale}`);
    localStorage.setItem('fb_font_scale', fontScale);
  }, [fontScale]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const cycleFontScale = () => {
    const scales: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
    const nextIdx = (scales.indexOf(fontScale) + 1) % scales.length;
    setFontScale(scales[nextIdx]);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Trang chủ', icon: Sparkles },
    { to: '/roadmap', label: 'Lộ trình', icon: Map },
    { to: '/dictionary', label: 'Từ điển F&B', icon: BookOpen },
    { to: '/practice', label: 'Luyện tập', icon: Sparkles },
    { to: '/phrasebook', label: 'Mẫu câu nhanh', icon: MessageSquareQuote },
    { to: '/menu-translator', label: 'Mô tả món', icon: Utensils }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-700 via-primary-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-primary-600/20 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>F&B English</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold uppercase tracking-wider">Hub</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
              Tiếng Anh Nhà hàng & Khách sạn thực chiến
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(link => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 font-bold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-all flex items-center gap-1.5 ml-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right side stats & controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gamification Stats (if logged in or guest) */}
          {(currentUser || isGuest) && (
            <div className="flex items-center gap-2 pr-1 sm:pr-2">
              {/* Streak */}
              <div
                title="Chuỗi ngày học liên tiếp"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 text-xs font-bold shadow-xs"
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
                <span>{userProfile?.streak || 1}d</span>
              </div>

              {/* XP */}
              <div
                title="Điểm kinh nghiệm (XP)"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold shadow-xs"
              >
                <Coins className="w-4 h-4 text-amber-500" />
                <span>{userProfile?.xp || 20}</span>
              </div>
            </div>
          )}

          {/* Font scale button */}
          <button
            onClick={cycleFontScale}
            title={`Cỡ chữ: ${fontScale.toUpperCase()}`}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all hidden sm:flex items-center justify-center text-xs font-bold"
          >
            <Type className="w-4 h-4" />
            <span className="text-[10px] ml-0.5 uppercase">{fontScale}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center justify-center"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User profile / login button */}
          {currentUser ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Avatar'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/30"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
            </Link>
          ) : isGuest ? (
            <Link
              to="/auth"
              className="px-3 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 shadow-sm active:scale-95 transition-all"
            >
              Đăng nhập
            </Link>
          ) : (
            <Link
              to="/auth"
              className="px-3.5 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 shadow-sm active:scale-95 transition-all"
            >
              Đăng nhập
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <link.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            to="/culture"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>Văn hóa & Tiền Tip</span>
          </Link>
          <Link
            to="/interview"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Utensils className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>Phỏng vấn xin việc F&B</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Trang Quản trị Admin</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

