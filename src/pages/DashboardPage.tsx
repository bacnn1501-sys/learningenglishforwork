import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Flame,
  Coins,
  BrainCircuit,
  Play,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  MessageSquareQuote,
  HelpCircle,
  Trophy,
  CheckCircle,
  Calendar,
  Globe,
  Clock,
  Layers
} from 'lucide-react';
import { getPublishedTracks, getUnitsByTrack, getLessonsByUnit, getUserProgressList, getUserSRSList } from '../services/db';
import { seedTracks, seedUnits, seedLessons } from '../data/seedData';
import { Track, Unit, Lesson, UserLessonProgress, UserSRSItem } from '../types';

export const DashboardPage: React.FC = () => {
  const { currentUser, userProfile, isGuest } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [recommendedLesson, setRecommendedLesson] = useState<Lesson | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, UserLessonProgress>>({});
  const [dueSrsCount, setDueSrsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const activeTrackId = userProfile?.trackId || 'waiter';

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        let loadedTracks = await getPublishedTracks();
        if (loadedTracks.length === 0) {
          loadedTracks = seedTracks;
        }
        setTracks(loadedTracks);

        const matchedTrack = loadedTracks.find(t => t.id === activeTrackId) || loadedTracks[0];
        setCurrentTrack(matchedTrack);

        // Fetch user progress
        let userProgress: Record<string, UserLessonProgress> = {};
        if (currentUser) {
          userProgress = await getUserProgressList(currentUser.uid);
          // Check SRS due words
          const srsItems = await getUserSRSList(currentUser.uid);
          const now = Date.now();
          const due = Object.values(srsItems).filter(item => item.nextReviewAt <= now).length;
          setDueSrsCount(due);
        } else if (isGuest) {
          const raw = localStorage.getItem('fb_english_guest_progress');
          if (raw) userProgress = JSON.parse(raw);
        }
        setProgressMap(userProgress);

        // Determine recommended lesson
        let units = await getUnitsByTrack(matchedTrack.id);
        if (units.length === 0) {
          units = seedUnits.filter(u => u.trackId === matchedTrack.id);
        }

        let firstUnfinishedLesson: Lesson | null = null;
        for (const unit of units) {
          let lessons = await getLessonsByUnit(unit.id);
          if (lessons.length === 0) {
            lessons = seedLessons.filter(l => l.unitId === unit.id);
          }
          for (const l of lessons) {
            if (!userProgress[l.id]?.completed) {
              firstUnfinishedLesson = l;
              break;
            }
          }
          if (firstUnfinishedLesson) break;
        }

        // Fallback to first lesson
        if (!firstUnfinishedLesson && seedLessons.length > 0) {
          firstUnfinishedLesson = seedLessons[0];
        }
        setRecommendedLesson(firstUnfinishedLesson);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [currentUser, activeTrackId, isGuest]);

  const streak = userProfile?.streak || 1;
  const xp = userProfile?.xp || 20;
  const dailyGoal = userProfile?.dailyGoalMinutes || 15;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Banner */}
      <section aria-label="Chào mừng" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-amber-600 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Chuyên ngành: {currentTrack?.nameVi || 'Phục vụ bàn'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Chào {currentUser?.displayName?.split(' ')[0] || 'bạn'}! Sẵn sàng nâng tầm giao tiếp F&B hôm nay?
          </h1>

          <p className="text-xs sm:text-sm text-primary-100 mt-2 leading-relaxed">
            Mục tiêu hôm nay: {dailyGoal} phút. Hãy hoàn thành ít nhất 1 bài học và ôn tập từ vựng để giữ vững Streak!
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {recommendedLesson && (
              <Link
                to={`/lesson/${recommendedLesson.id}`}
                className="px-5 py-2.5 rounded-2xl bg-white text-primary-700 hover:bg-amber-50 active:scale-95 text-xs font-black shadow-lg flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-primary-700" />
                <span>Tiếp tục học ngay</span>
              </Link>
            )}

            <Link
              to="/srs"
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/20"
            >
              <BrainCircuit className="w-4 h-4 text-amber-300" />
              <span>Ôn tập hôm nay ({dueSrsCount > 0 ? `${dueSrsCount} từ` : 'Sẵn sàng'})</span>
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 text-7xl opacity-20 pointer-events-none hidden md:block">
          🍽️
        </div>
      </section>

      {/* Stats Cards Row */}
      <section aria-label="Chỉ số học tập" className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
            <Flame className="w-6 h-6 fill-orange-500" />
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100">{streak} ngày</div>
            <p className="text-[11px] text-neutral-500 font-medium">Chuỗi liên tiếp</p>
          </div>
        </div>

        {/* XP */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100">{xp} XP</div>
            <p className="text-[11px] text-neutral-500 font-medium">Điểm tích lũy</p>
          </div>
        </div>

        {/* Level */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100">
              {userProfile?.level || 'A1'}
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">Khung CEFR</p>
          </div>
        </div>

        {/* Words Mastered */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100">
              {Object.keys(progressMap).length * 8 + 12}
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">Từ đã nạp</p>
          </div>
        </div>
      </section>

      {/* Today's Recommended Lesson & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column: Recommended Lesson */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span>Bài học đề xuất hôm nay</span>
            </h2>
            <Link to="/roadmap" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              <span>Xem toàn bộ lộ trình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recommendedLesson ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm culinary-card-hover">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                    {recommendedLesson.type}
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 mt-2">
                    {recommendedLesson.titleVi}
                  </h3>
                  <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                    {recommendedLesson.titleEn}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2">
                    {recommendedLesson.contentSummary || 'Luyện tập hội thoại, từ vựng và xử lý tình huống thực tế cùng khách quốc tế.'}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Play className="w-6 h-6 fill-primary-600" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Khoảng 8 - 10 phút</span>
                  <span>•</span>
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>+{recommendedLesson.xpReward} XP</span>
                </div>

                <Link
                  to={`/lesson/${recommendedLesson.id}`}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Bắt đầu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold">Bạn đã hoàn thành các bài học hiện tại!</p>
            </div>
          )}

          {/* Spaced Repetition (SRS) Callout */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-200/70 dark:bg-amber-900/60 flex items-center justify-center text-amber-800 dark:text-amber-300 flex-shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                  Thuật toán ngắt quãng SM-2 (Flashcards)
                </h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Lặp lại thông minh giúp từ vựng ghi nhớ sâu vào phản xạ mà không bị quên sau giờ làm.
                </p>
              </div>
            </div>
            <Link
              to="/srs"
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap active:scale-95 transition-all shadow-sm"
            >
              Ôn ngay
            </Link>
          </div>
        </div>

        {/* Right Column: F&B Toolkit Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Công cụ làm việc tức thì</span>
          </h2>

          <div className="grid grid-cols-1 gap-2.5">
            <Link
              to="/phrasebook"
              className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-primary-400 dark:hover:border-primary-600 shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors">
                    Mẫu câu giao tiếp nhanh
                  </h4>
                  <p className="text-[10px] text-neutral-400">Tra cứu tình huống, dùng ngay trong ca</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/menu-translator"
              className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-primary-400 dark:hover:border-primary-600 shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors">
                    Menu Translator & Mô tả món
                  </h4>
                  <p className="text-[10px] text-neutral-400">Dịch tên món Việt & mẫu script giới thiệu</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/culture"
              className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-primary-400 dark:hover:border-primary-600 shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors">
                    Văn hóa & Tiền Tip quốc tế
                  </h4>
                  <p className="text-[10px] text-neutral-400">Quy tắc tip, kiêng khem Halal, Kosher</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/interview"
              className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-primary-400 dark:hover:border-primary-600 shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 transition-colors">
                    Phỏng vấn xin việc F&B
                  </h4>
                  <p className="text-[10px] text-neutral-400">Bộ câu hỏi tuyển dụng & câu trả lời mẫu</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

