import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Shield,
  Settings,
  Bell,
  Trash2,
  LogOut,
  Moon,
  Sun,
  Type,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { seedTracks } from '../data/seedData';
import { CEFRLevel } from '../types';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    userProfile,
    isAdmin,
    isGuest,
    logout,
    updateUserProfileState,
    deleteAccount
  } = useAuth();
  const navigate = useNavigate();

  const [trackId, setTrackId] = useState(userProfile?.trackId || 'waiter');
  const [level, setLevel] = useState<CEFRLevel>(userProfile?.level || 'A1');
  const [dailyGoal, setDailyGoal] = useState(userProfile?.dailyGoalMinutes || 15);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveSettings = async () => {
    try {
      await updateUserProfileState({
        trackId,
        level,
        dailyGoalMinutes: dailyGoal
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate('/auth');
    } catch (e) {
      console.error('Error deleting account:', e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4">
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-500/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-600 text-white font-black text-2xl flex items-center justify-center">
            {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-900 dark:text-neutral-100">
              {currentUser?.displayName || (isGuest ? 'Khách (Guest)' : 'Học viên F&B')}
            </h1>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {currentUser?.email || 'Tài khoản khách tạm thời'}
          </p>
        </div>
      </div>

      {/* Learning Preferences Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary-600" />
          <span>Tùy chỉnh Lộ trình & Mục tiêu</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold block mb-1">Chuyên ngành F&B của bạn:</label>
            <select
              value={trackId}
              onChange={e => setTrackId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 font-semibold"
            >
              {seedTracks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nameVi} ({t.nameEn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Khung trình độ tiếng Anh:</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value as CEFRLevel)}
              className="w-full px-3 py-2.5 rounded-xl border bg-neutral-50 dark:bg-neutral-800 font-semibold"
            >
              <option value="A1">A1 - Mới bắt đầu</option>
              <option value="A2">A2 - Giao tiếp cơ bản</option>
              <option value="B1">B1 - Độc lập / Quầy Bar / Wine</option>
              <option value="B2">B2 - Quản lý / HACCP / Phỏng vấn</option>
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Mục tiêu học mỗi ngày:</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 30].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoal(mins)}
                  className={`py-2 rounded-xl font-bold border-2 transition-all ${
                    dailyGoal === mins
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {mins} phút/ngày
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Đã lưu thành công!</span>
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            className="ml-auto px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">
          Tài khoản & Dữ liệu cá nhân
        </h2>

        <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4 text-neutral-500" />
            <span>Đăng xuất</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold text-red-600 flex items-center justify-center gap-2 transition-all sm:ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa tài khoản & dữ liệu cá nhân</span>
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200 dark:border-red-900 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              Bạn có chắc chắn muốn xóa tài khoản?
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Toàn bộ tiến độ học tập, điểm XP, streak và sổ từ vựng cá nhân của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-sm"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

