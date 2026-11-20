import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BrainCircuit,
  Volume2,
  RotateCw,
  Check,
  ArrowLeft,
  Sparkles,
  Trophy,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getUserSRSList, saveUserSRSItem, getVocabularyByIds } from '../services/db';
import { seedVocabulary } from '../data/seedData';
import { VocabularyItem, UserSRSItem } from '../types';
import { calculateSM2 } from '../utils/srs';
import { AudioButton } from '../components/common/AudioButton';

export const SRSReviewPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [reviewQueue, setReviewQueue] = useState<VocabularyItem[]>([]);
  const [srsMap, setSrsMap] = useState<Record<string, UserSRSItem>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  useEffect(() => {
    async function loadSRSQueue() {
      setLoading(true);
      try {
        let items: VocabularyItem[] = [];
        let srsRecords: Record<string, UserSRSItem> = {};

        if (currentUser) {
          srsRecords = await getUserSRSList(currentUser.uid);
          setSrsMap(srsRecords);

          const now = Date.now();
          const dueWordIds = Object.values(srsRecords)
            .filter(item => item.nextReviewAt <= now)
            .map(i => i.wordId);

          if (dueWordIds.length > 0) {
            items = await getVocabularyByIds(dueWordIds);
          }
        }

        // If no due words in database, pick 10 words for daily practice
        if (items.length === 0) {
          items = seedVocabulary.slice(0, 10);
        }

        setReviewQueue(items);
      } catch (e) {
        console.error('Error loading SRS queue:', e);
        setReviewQueue(seedVocabulary.slice(0, 10));
      } finally {
        setLoading(false);
      }
    }
    loadSRSQueue();
  }, [currentUser]);

  const currentWord = reviewQueue[currentIndex];

  const handleRate = async (quality: 1 | 3 | 4 | 5) => {
    if (!currentWord) return;

    // Calculate next SM-2 interval
    const existing = srsMap[currentWord.id];
    const newSRSData = calculateSM2(existing, quality as any);
    const updatedItem: UserSRSItem = {
      wordId: currentWord.id,
      ...newSRSData
    };

    setSrsMap(prev => ({ ...prev, [currentWord.id]: updatedItem }));
    setReviewedCount(prev => prev + 1);

    if (currentUser) {
      await saveUserSRSItem(currentUser.uid, updatedItem);
    }

    // Advance to next card or complete
    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionCompleted(true);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
        <p className="text-xs text-neutral-500">Đang chuẩn bị bộ thẻ ôn tập...</p>
      </div>
    );
  }

  if (sessionCompleted || reviewQueue.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
          Hoàn thành ôn tập hôm nay!
        </h2>
        <p className="text-xs text-neutral-500">
          Bạn vừa củng cố <span className="font-bold text-primary-600">{reviewedCount} từ vựng</span> vào trí nhớ dài hạn theo chu kỳ lặp lại ngắt quãng SM-2.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all"
        >
          Trở về Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-bold text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
          <BrainCircuit className="w-4 h-4" />
          <span>SM-2 Spaced Repetition</span>
        </div>

        <span className="text-xs font-bold text-neutral-500">
          {currentIndex + 1}/{reviewQueue.length}
        </span>
      </div>

      {/* Flashcard (Card Flip Area) */}
      <div
        onClick={() => setIsFlipped(prev => !prev)}
        className="min-h-[320px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-primary-200 dark:border-primary-900/60 shadow-xl flex flex-col justify-between cursor-pointer transition-all hover:border-primary-400 relative select-none"
      >
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 uppercase">
            {currentWord.partOfSpeech} • Level {currentWord.level}
          </span>
          <AudioButton text={currentWord.term} size="md" showSlowToggle={true} />
        </div>

        {/* Card Content (Front vs Back) */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="text-center py-8">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
              {currentWord.term}
            </h2>
            <p className="text-sm font-mono text-neutral-400 mt-2">
              {currentWord.ipa}
            </p>
            <p className="text-xs text-neutral-400 mt-6 flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Chạm vào thẻ để xem nghĩa tiếng Việt & ví dụ</span>
            </p>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="text-center py-4 space-y-3 animate-fade-in">
            <h3 className="text-xl font-black text-primary-600 dark:text-primary-400">
              {currentWord.meaningVi}
            </h3>
            <p className="text-xs text-neutral-500">
              {currentWord.definitionEn}
            </p>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl text-left text-xs space-y-1">
              <p className="italic font-medium text-neutral-800 dark:text-neutral-200">
                "{currentWord.exampleEn}"
              </p>
              <p className="text-neutral-500">→ {currentWord.exampleVi}</p>
            </div>

            {currentWord.culturalNotes && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl text-left">
                💡 {currentWord.culturalNotes}
              </p>
            )}
          </div>
        )}

        <div className="text-center text-[11px] text-neutral-400">
          Chuyên ngành: <span className="font-semibold">{currentWord.track}</span>
        </div>
      </div>

      {/* SM-2 Rating Controls (Only visible when flipped) */}
      {isFlipped ? (
        <div className="space-y-2">
          <p className="text-center text-xs font-semibold text-neutral-500">
            Bạn nhớ từ này ở mức độ nào?
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleRate(1)}
              className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 text-center transition-all active:scale-95 border border-red-200 dark:border-red-900"
            >
              <span className="block font-black text-sm">Quên</span>
              <span className="text-[10px] text-neutral-400">1 ngày</span>
            </button>

            <button
              onClick={() => handleRate(3)}
              className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-center transition-all active:scale-95 border border-amber-200 dark:border-amber-900"
            >
              <span className="block font-black text-sm">Khó</span>
              <span className="text-[10px] text-neutral-400">2 ngày</span>
            </button>

            <button
              onClick={() => handleRate(4)}
              className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-center transition-all active:scale-95 border border-sky-200 dark:border-sky-900"
            >
              <span className="block font-black text-sm">Tốt</span>
              <span className="text-[10px] text-neutral-400">4 ngày</span>
            </button>

            <button
              onClick={() => handleRate(5)}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-center transition-all active:scale-95 border border-emerald-200 dark:border-emerald-900"
            >
              <span className="block font-black text-sm">Dễ</span>
              <span className="text-[10px] text-neutral-400">7 ngày</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Lật thẻ xem đáp án
          </button>
        </div>
      )}
    </div>
  );
};

