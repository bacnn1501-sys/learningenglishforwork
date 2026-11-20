import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Award,
  Crown,
  Sparkles,
  ShieldCheck,
  Star
} from 'lucide-react';
import { getWeeklyLeaderboard } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardEntry } from '../types';

export const LeaderboardPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoard() {
      setLoading(true);
      try {
        const list = await getWeeklyLeaderboard();
        if (list.length === 0) {
          // Sample mock top entries for initial display
          setEntries([
            { uid: 'u1', displayName: 'Hương Linh (Barista)', xp: 480, streak: 12, updatedAt: Date.now() },
            { uid: 'u2', displayName: 'Tuấn Anh (Waiter)', xp: 420, streak: 9, updatedAt: Date.now() },
            { uid: 'u3', displayName: 'Minh Khoa (Bartender)', xp: 390, streak: 8, updatedAt: Date.now() },
            { uid: 'u4', displayName: 'Thanh Thảo (Hostess)', xp: 350, streak: 6, updatedAt: Date.now() },
            { uid: 'u5', displayName: 'Quốc Bảo (Chef)', xp: 310, streak: 5, updatedAt: Date.now() },
            { uid: 'u6', displayName: 'Kim Ngân (F&B)', xp: 280, streak: 4, updatedAt: Date.now() }
          ]);
        } else {
          setEntries(list);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadBoard();
  }, []);

  const badges = [
    { name: 'Khởi đầu Hoàn hảo', desc: 'Hoàn thành bài học đầu tiên', icon: '🌟', unlocked: true },
    { name: 'Chuỗi 3 ngày', desc: 'Giữ streak 3 ngày liên tiếp', icon: '🔥', unlocked: (userProfile?.streak || 1) >= 3 },
    { name: 'Chuỗi 7 ngày', desc: 'Giữ streak 7 ngày liên tiếp', icon: '⚡', unlocked: (userProfile?.streak || 1) >= 7 },
    { name: 'Chuyên gia Menu', desc: 'Học từ 20 món ăn & thức uống', icon: '🍽️', unlocked: (userProfile?.xp || 0) >= 100 },
    { name: 'Xử lý Phàn nàn', desc: 'Nắm vững quy tắc L.A.S.T', icon: '🛡️', unlocked: true },
    { name: 'F&B Star', desc: 'Đạt trên 300 điểm XP tuần', icon: '👑', unlocked: (userProfile?.xp || 0) >= 300 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Bảng xếp hạng & Huy hiệu
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Top 20 học viên tích cực nhất trong tuần. Tích lũy XP qua mỗi bài học và bài kiểm tra để thăng hạng!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Top 20 Leaderboard */}
        <div className="md:col-span-2 space-y-3">
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Bảng vàng Tuần này (Top 20)</span>
            </h2>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {entries.map((item, idx) => {
                const isTop1 = idx === 0;
                const isTop2 = idx === 1;
                const isTop3 = idx === 2;
                const isMe = item.uid === currentUser?.uid;

                return (
                  <div
                    key={item.uid}
                    className={`py-3 flex items-center justify-between gap-3 px-2 rounded-2xl transition-colors ${
                      isMe ? 'bg-primary-50 dark:bg-primary-950/40 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 text-center font-black text-sm text-neutral-400">
                        {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${idx + 1}`}
                      </div>

                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        {item.displayName[0]}
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {item.displayName} {isMe && '(Bạn)'}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-orange-600 font-semibold">
                          <Flame className="w-3 h-3 fill-orange-500" />
                          <span>{item.streak} ngày</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-black text-primary-600 dark:text-primary-400">
                        {item.xp} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Badges / Achievements Collection */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-base font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary-600" />
              <span>Huy hiệu đạt được</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    b.unlocked
                      ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 opacity-40 grayscale'
                  }`}
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {b.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

