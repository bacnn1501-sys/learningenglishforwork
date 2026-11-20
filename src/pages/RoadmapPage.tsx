import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Lock,
  CheckCircle2,
  Play,
  Sparkles,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Award,
  ChevronRight,
  UtensilsCrossed,
  Wine,
  Coffee,
  ChefHat
} from 'lucide-react';
import { getPublishedTracks, getUnitsByTrack, getLessonsByUnit, getUserProgressList } from '../services/db';
import { seedTracks, seedUnits, seedLessons } from '../data/seedData';
import { Track, Unit, Lesson, UserLessonProgress } from '../types';

export const RoadmapPage: React.FC = () => {
  const { currentUser, userProfile, isGuest } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string>(userProfile?.trackId || 'waiter');
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitLessonsMap, setUnitLessonsMap] = useState<Record<string, Lesson[]>>({});
  const [progressMap, setProgressMap] = useState<Record<string, UserLessonProgress>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Load tracks
  useEffect(() => {
    async function loadTracks() {
      let t = await getPublishedTracks();
      if (t.length === 0) t = seedTracks;
      setTracks(t);
    }
    loadTracks();
  }, []);

  // Load units, lessons, progress
  useEffect(() => {
    async function loadRoadmapData() {
      setLoading(true);
      try {
        let u = await getUnitsByTrack(selectedTrackId);
        if (u.length === 0) {
          u = seedUnits.filter(item => item.trackId === selectedTrackId);
        }
        setUnits(u);

        // Fetch lessons for all units in track
        const map: Record<string, Lesson[]> = {};
        for (const unit of u) {
          let ls = await getLessonsByUnit(unit.id);
          if (ls.length === 0) {
            ls = seedLessons.filter(l => l.unitId === unit.id);
          }
          map[unit.id] = ls;
        }
        setUnitLessonsMap(map);

        // User progress
        let userProgress: Record<string, UserLessonProgress> = {};
        if (currentUser) {
          userProgress = await getUserProgressList(currentUser.uid);
        } else if (isGuest) {
          const raw = localStorage.getItem('fb_english_guest_progress');
          if (raw) userProgress = JSON.parse(raw);
        }
        setProgressMap(userProgress);
      } catch (e) {
        console.error('Error loading roadmap:', e);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmapData();
  }, [selectedTrackId, currentUser, isGuest]);

  // Calculate unit score percentage
  const getUnitProgressPercent = (unitId: string): number => {
    const lessons = unitLessonsMap[unitId] || [];
    if (lessons.length === 0) return 0;
    const completedCount = lessons.filter(l => progressMap[l.id]?.completed).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return BookOpen;
      case 'dialogue':
        return MessageSquare;
      case 'roleplay':
        return Sparkles;
      case 'checkpoint':
        return Award;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Lộ trình học theo Vị trí
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
          Cấu trúc từ A1 đến B2 theo chu trình: Từ vựng → Mẫu câu → Hội thoại → Bài tập → Role-play.
        </p>
      </div>

      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tracks.map(t => {
          const isActive = selectedTrackId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTrackId(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'
              }`}
            >
              <span>{t.nameVi}</span>
            </button>
          );
        })}
      </div>

      {/* Units Roadmap Tree */}
      <div className="space-y-6">
        {units.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200">
            <p className="text-xs text-neutral-500">Chưa có bài học nào được xuất bản cho lộ trình này.</p>
          </div>
        ) : (
          units.map((unit, unitIdx) => {
            const percent = getUnitProgressPercent(unit.id);
            // Unlock next unit if previous unit has >= 70% or if it's the first unit
            const isUnlocked = unitIdx === 0 || getUnitProgressPercent(units[unitIdx - 1].id) >= 70;
            const lessons = unitLessonsMap[unit.id] || [];

            return (
              <div
                key={unit.id}
                className={`rounded-3xl border transition-all ${
                  isUnlocked
                    ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm'
                    : 'bg-neutral-50/60 dark:bg-neutral-900/40 border-neutral-200/50 dark:border-neutral-800/40 opacity-70'
                }`}
              >
                {/* Unit Header */}
                <div className="p-5 sm:p-6 border-b border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        isUnlocked
                          ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {isUnlocked ? `U${unitIdx + 1}` : <Lock className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          Level {unit.level}
                        </span>
                        {percent >= 70 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã đạt</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100 mt-1">
                        {unit.titleVi}
                      </h2>
                      <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                        {unit.titleEn}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full sm:w-44">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 mb-1">
                      <span>Tiến độ</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-primary-600 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lessons List inside Unit */}
                <div className="p-4 sm:p-5 divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {lessons.map((lesson, lessonIdx) => {
                    const isCompleted = progressMap[lesson.id]?.completed;
                    const LessonIcon = getLessonTypeIcon(lesson.type);

                    return (
                      <div
                        key={lesson.id}
                        className="py-3 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <LessonIcon className="w-4 h-4" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                {lesson.type}
                              </span>
                              <span className="text-[10px] text-amber-600 font-bold">
                                +{lesson.xpReward} XP
                              </span>
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                              {lesson.titleVi}
                            </h3>
                            <p className="text-[11px] text-neutral-500">
                              {lesson.titleEn}
                            </p>
                          </div>
                        </div>

                        {isUnlocked ? (
                          <Link
                            to={`/lesson/${lesson.id}`}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-xs'
                            }`}
                          >
                            <span>{isCompleted ? 'Ôn lại' : 'Học'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="p-2 text-neutral-300">
                            <Lock className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

