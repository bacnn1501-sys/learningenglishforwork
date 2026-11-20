import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
          Đang xác thực quyền Admin...
        </p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-red-200 dark:border-red-900/50 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Truy cập bị từ chối
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          Khu vực này chỉ dành cho Quản trị viên (Admin) có custom claim được cấp qua script Node:
          <code className="block my-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
            node scripts/set-admin.js email@domain.com
          </code>
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return children;
};

