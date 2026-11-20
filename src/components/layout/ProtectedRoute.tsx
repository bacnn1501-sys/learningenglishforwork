import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
          Đang tải dữ liệu học tập...
        </p>
      </div>
    );
  }

  // Allow either authenticated users OR guests
  if (!currentUser && !isGuest) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

