import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    continueAsGuest,
    authError,
    clearAuthError,
    currentUser,
    userProfile
  } = useAuth();

  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // If already logged in, navigate
  React.useEffect(() => {
    if (currentUser) {
      if (userProfile && !userProfile.onboardingDone) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, userProfile, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Navigation is handled by effect
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
    } catch (err) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setResetModalOpen(false);
      }, 3000);
    } catch (err) {
      // Handled by context
    } finally {
      setResetLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200/90 dark:border-neutral-800 p-6 sm:p-8 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>F&B English Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {mode === 'login' ? 'Chào mừng bạn trở lại' : 'Tạo tài khoản học tập'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
            Làm chủ tiếng Anh giao tiếp Nhà hàng - Khách sạn ngay hôm nay
          </p>
        </div>

        {/* Friendly Error Banner */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{authError}</span>
            </div>
            <button onClick={clearAuthError} className="text-xs font-bold ml-1 opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Primary Method: Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 font-bold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-750 hover:border-neutral-300 dark:hover:border-neutral-600 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {/* Official Google G Logo */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Tiếp tục với Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
          <span className="relative bg-white dark:bg-neutral-900 px-3 text-xs text-neutral-400 uppercase font-semibold">
            hoặc email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Họ và tên của bạn
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@restaurant.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Mật khẩu
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-primary-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Đăng ký tài khoản</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {mode === 'login' ? (
            <span>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  clearAuthError();
                }}
                className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Đăng ký ngay
              </button>
            </span>
          ) : (
            <span>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  clearAuthError();
                }}
                className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Đăng nhập
              </button>
            </span>
          )}
        </div>

        {/* Guest Mode option */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 text-center">
          <button
            type="button"
            onClick={handleGuest}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Dùng thử chế độ Khách (Guest) không cần đăng nhập</span>
            <span>→</span>
          </button>
          <p className="text-[10px] text-neutral-400 mt-1">
            Tiến độ sẽ được lưu trên máy và tự động đồng bộ khi bạn đăng nhập Google.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mb-1.5">
              Đặt lại mật khẩu
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Nhập email tài khoản của bạn. Chúng tôi sẽ gửi liên kết khôi phục mật khẩu.
            </p>

            {resetSent ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Đã gửi email khôi phục! Vui lòng kiểm tra hộp thư đến (và mục Spam).
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@restaurant.com"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-100 rounded-xl"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 text-xs font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
                  >
                    {resetLoading ? 'Đang gửi...' : 'Gửi email'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

