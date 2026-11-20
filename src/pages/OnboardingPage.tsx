import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { seedTracks, seedPlacementQuestions } from '../data/seedData';
import { CEFRLevel } from '../types';
import {
  UtensilsCrossed,
  Wine,
  Coffee,
  ChefHat,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Check,
  HelpCircle
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  UtensilsCrossed,
  Wine,
  Coffee,
  ChefHat,
  Sparkles,
  Award
};

export const OnboardingPage: React.FC = () => {
  const { userProfile, updateUserProfileState } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>(userProfile?.trackId || 'waiter');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(userProfile?.level || 'A1');
  const [dailyGoal, setDailyGoal] = useState<number>(userProfile?.dailyGoalMinutes || 15);

  // Placement Test State
  const [doPlacementTest, setDoPlacementTest] = useState(false);
  const [testQuestionIndex, setTestQuestionIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testScore, setTestScore] = useState<number | null>(null);

  const handleFinishOnboarding = async () => {
    try {
      await updateUserProfileState({
        trackId: selectedTrack,
        level: selectedLevel,
        dailyGoalMinutes: dailyGoal,
        onboardingDone: true
      });
      navigate('/dashboard');
    } catch (e) {
      console.error('Error saving onboarding:', e);
      navigate('/dashboard');
    }
  };

  const handleAnswerQuestion = (optionIndex: number) => {
    setTestAnswers(prev => ({ ...prev, [testQuestionIndex]: optionIndex }));
    if (testQuestionIndex < seedPlacementQuestions.length - 1) {
      setTestQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score & recommended level
      let correctCount = 0;
      seedPlacementQuestions.forEach((q, idx) => {
        const ans = idx === testQuestionIndex ? optionIndex : testAnswers[idx];
        if (ans === q.correctIndex) {
          correctCount++;
        }
      });
      setTestScore(correctCount);

      // Determine level based on score out of 15
      let assignedLevel: CEFRLevel = 'A1';
      if (correctCount >= 12) assignedLevel = 'B2';
      else if (correctCount >= 9) assignedLevel = 'B1';
      else if (correctCount >= 5) assignedLevel = 'A2';
      else assignedLevel = 'A1';

      setSelectedLevel(assignedLevel);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-2">
          <span>Bước {step} trên 3</span>
          <span>
            {step === 1 && 'Chọn chuyên ngành F&B'}
            {step === 2 && 'Trình độ tiếng Anh'}
            {step === 3 && 'Mục tiêu học mỗi ngày'}
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Select Track */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
              Vị trí công việc chính của bạn trong ngành F&B?
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
              Lựa chọn đúng chuyên môn để nội dung từ vựng và tình huống bám sát công việc thực tế nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {seedTracks.map(t => {
              const IconComp = iconMap[t.icon] || UtensilsCrossed;
              const isSelected = selectedTrack === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/70 dark:bg-primary-950/40 shadow-md ring-2 ring-primary-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: t.color || '#B93815' }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {t.nameVi}
                      </h3>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-600" />}
                    </div>
                    <p className="text-xs text-primary-700 dark:text-primary-300 font-medium">
                      {t.nameEn}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {t.descriptionVi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2 shadow-md"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Placement Test or Self-Select Level */}
      {step === 2 && (
        <div className="space-y-6">
          {!doPlacementTest ? (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                  Xác định trình độ tiếng Anh của bạn
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                  Bạn có thể làm bài kiểm tra nhanh 15 câu (3-5 phút) hoặc tự chọn mức độ quen thuộc.
                </p>
              </div>

              {/* Placement test banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary-500/10 to-transparent border border-amber-300 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Khuyến nghị</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                    Làm bài kiểm tra đầu vào (15 câu)
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Hệ thống sẽ tự động phân loại trình độ từ A1 đến B2 chuẩn xác nhất.
                  </p>
                </div>
                <button
                  onClick={() => setDoPlacementTest(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all whitespace-nowrap"
                >
                  Bắt đầu kiểm tra
                </button>
              </div>

              {/* Self-select Levels */}
              <div>
                <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-3">
                  Hoặc tự chọn cấp độ bạn tự tin:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      lvl: 'A1' as CEFRLevel,
                      title: 'A1 - Bắt đầu (Beginner)',
                      desc: 'Mới làm quen, biết chào hỏi cơ bản, đọc số bàn, menu đơn giản.'
                    },
                    {
                      lvl: 'A2' as CEFRLevel,
                      title: 'A2 - Cơ bản (Elementary)',
                      desc: 'Ghi món cơ bản, hỏi độ chín bò bít tết, xử lý thanh toán và tách bill.'
                    },
                    {
                      lvl: 'B1' as CEFRLevel,
                      title: 'B1 - Độc lập (Intermediate)',
                      desc: 'Tư vấn rượu vang, xử lý phàn nàn của khách theo quy tắc L.A.S.T, giao tiếp quầy bar trôi chảy.'
                    },
                    {
                      lvl: 'B2' as CEFRLevel,
                      title: 'B2 - Thành thạo (Upper-Intermediate)',
                      desc: 'Điều hành ca làm việc, đào tạo nhân viên, kiểm tra an toàn HACCP và phỏng vấn quản lý F&B.'
                    }
                  ].map(item => {
                    const isSelected = selectedLevel === item.lvl;
                    return (
                      <div
                        key={item.lvl}
                        onClick={() => setSelectedLevel(item.lvl)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50/70 dark:bg-primary-950/40 shadow-sm'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                            {item.title}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-600" />}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2 shadow-md"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Placement Test In Progress */
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-lg">
              {testScore === null ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                    <span>
                      Câu {testQuestionIndex + 1}/{seedPlacementQuestions.length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold uppercase text-[10px]">
                      {seedPlacementQuestions[testQuestionIndex].level}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 mb-1">
                    {seedPlacementQuestions[testQuestionIndex].questionEn}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
                    {seedPlacementQuestions[testQuestionIndex].questionVi}
                  </p>

                  <div className="space-y-2.5">
                    {seedPlacementQuestions[testQuestionIndex].options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerQuestion(optIdx)}
                        className="w-full text-left p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 text-xs sm:text-sm font-medium transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Test Result */
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto mb-3">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                    Kết quả kiểm tra: {testScore}/{seedPlacementQuestions.length} điểm
                  </h3>
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">
                    Trình độ khuyến nghị: {selectedLevel}
                  </p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-2">
                    Lộ trình của bạn đã được tối ưu hóa cho cấp độ {selectedLevel}. Bạn hoàn toàn có thể tự chuyển cấp độ bất kỳ lúc nào trong Hồ sơ.
                  </p>

                  <button
                    onClick={() => {
                      setDoPlacementTest(false);
                      setStep(3);
                    }}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 shadow-md transition-all"
                  >
                    Tiếp tục sang bước 3
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Daily Study Goal */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
              Đặt mục tiêu luyện tập mỗi ngày
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
              Học đều đặn 10-20 phút giữa ca làm hiệu quả hơn học dồn một lần.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                mins: 10,
                label: 'Khởi động',
                desc: 'Phù hợp người bận rộn, ôn 1 bài học + 5 từ vựng nhanh.',
                tag: 'Dễ dàng'
              },
              {
                mins: 15,
                label: 'Chuẩn mực',
                desc: 'Hoàn thành 1 bài học, 10 từ vựng và 1 bài luyện nói.',
                tag: 'Khuyên dùng'
              },
              {
                mins: 30,
                label: 'Bứt phá',
                desc: 'Luyện sâu tình huống, xử lý phàn nàn và luyện phản xạ hội thoại.',
                tag: 'Nâng cao'
              }
            ].map(item => {
              const isSelected = dailyGoal === item.mins;
              return (
                <div
                  key={item.mins}
                  onClick={() => setDailyGoal(item.mins)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all text-center relative ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/70 dark:bg-primary-950/40 shadow-md ring-2 ring-primary-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-bold uppercase tracking-wider text-neutral-500">
                    {item.tag}
                  </span>
                  <div className="text-3xl font-black text-neutral-900 dark:text-neutral-100 my-2">
                    {item.mins} <span className="text-xs font-normal text-neutral-400">phút/ngày</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
            >
              Quay lại
            </button>
            <button
              onClick={handleFinishOnboarding}
              className="px-8 py-3 rounded-2xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary-600/30"
            >
              <span>Vào học ngay</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

