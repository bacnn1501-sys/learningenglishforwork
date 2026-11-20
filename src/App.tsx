import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy-loaded route pages for bundle performance
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage').then(m => ({ default: m.RoadmapPage })));
const LessonViewerPage = lazy(() => import('./pages/LessonViewerPage').then(m => ({ default: m.LessonViewerPage })));
const VocabularyDictionaryPage = lazy(() => import('./pages/VocabularyDictionaryPage').then(m => ({ default: m.VocabularyDictionaryPage })));
const SRSReviewPage = lazy(() => import('./pages/SRSReviewPage').then(m => ({ default: m.SRSReviewPage })));
const PracticeHubPage = lazy(() => import('./pages/PracticeHubPage').then(m => ({ default: m.PracticeHubPage })));
const PhrasebookPage = lazy(() => import('./pages/PhrasebookPage').then(m => ({ default: m.PhrasebookPage })));
const MenuTranslatorPage = lazy(() => import('./pages/MenuTranslatorPage').then(m => ({ default: m.MenuTranslatorPage })));
const CultureEtiquettePage = lazy(() => import('./pages/CultureEtiquettePage').then(m => ({ default: m.CultureEtiquettePage })));
const MockInterviewPage = lazy(() => import('./pages/MockInterviewPage').then(m => ({ default: m.MockInterviewPage })));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminPortalPage = lazy(() => import('./pages/AdminPortalPage').then(m => ({ default: m.AdminPortalPage })));

const RouteLoading: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
    <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
    <span className="text-xs text-neutral-400 font-medium">Đang mở trang...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppLayout>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                {/* Public Auth Route */}
                <Route path="/auth" element={<AuthPage />} />

                {/* Onboarding */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  }
                />

                {/* Core Learning & Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/roadmap"
                  element={
                    <ProtectedRoute>
                      <RoadmapPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/lesson/:lessonId"
                  element={
                    <ProtectedRoute>
                      <LessonViewerPage />
                    </ProtectedRoute>
                  }
                />

                {/* Vocabulary & SRS */}
                <Route
                  path="/dictionary"
                  element={
                    <ProtectedRoute>
                      <VocabularyDictionaryPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/srs"
                  element={
                    <ProtectedRoute>
                      <SRSReviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* Practice & Toolkit */}
                <Route
                  path="/practice"
                  element={
                    <ProtectedRoute>
                      <PracticeHubPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/phrasebook"
                  element={
                    <ProtectedRoute>
                      <PhrasebookPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/menu-translator"
                  element={
                    <ProtectedRoute>
                      <MenuTranslatorPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/culture"
                  element={
                    <ProtectedRoute>
                      <CultureEtiquettePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/interview"
                  element={
                    <ProtectedRoute>
                      <MockInterviewPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <LeaderboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Portal (Protected by custom claim admin: true) */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPortalPage />
                    </AdminRoute>
                  }
                />

                {/* Root & Fallback */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </AppLayout>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
