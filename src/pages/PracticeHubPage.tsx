import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Zap,
  Mic,
  AlertTriangle,
  BookMarked,
  Timer,
  CheckCircle,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  getUserMistakes,
  resolveUserMistake,
  getUserCustomWords,
  addUserCustomWord,
  deleteUserCustomWord
} from '../services/db';
import { seedVocabulary, seedExercises } from '../data/seedData';
import { UserMistakeItem, UserCustomWord, VocabularyItem } from '../types';
import { AudioButton } from '../components/common/AudioButton';
import { createSpeechRecognizer } from '../utils/speech';
import { calculateSimilarity } from '../utils/text';

export const PracticeHubPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'mistakes' | 'speed_quiz' | 'speaking' | 'my_words'>('mistakes');

  // Mistake Notebook state
  const [mistakes, setMistakes] = useState<UserMistakeItem[]>([]);
  const [loadingMistakes, setLoadingMistakes] = useState(false);

  // My Custom Words state
  const [customWords, setCustomWords] = useState<UserCustomWord[]>([]);
  const [newTerm, setNewTerm] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  // Speed Quiz state
  const [quizRunning, setQuizRunning] = useState(false);
  const [quizTimeLeft, setQuizTimeLeft] = useState(45);
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<VocabularyItem[]>([]);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  // Speaking Lab state
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);

  const speakingPrompts = [
    { en: 'Good evening! Do you have a reservation with us tonight?', vi: 'Chào buổi tối! Anh chị đã đặt bàn trước tối nay chưa ạ?' },
    { en: 'Would you prefer indoor seating or a table on the garden terrace?', vi: 'Quý khách thích ngồi trong nhà hay ngoài sân hiên vườn ạ?' },
    { en: 'Does anyone at the table have any severe food allergies?', vi: 'Bàn mình có ai bị dị ứng thực phẩm nghiêm trọng không ạ?' },
    { en: 'I sincerely apologize for the delay, let me check with the chef.', vi: 'Em thành thật xin lỗi về sự chậm trễ, để em vào kiểm tra với bếp trưởng ạ.' },
    { en: 'Would you like your single malt whiskey neat or on the rocks?', vi: 'Anh muốn dùng whiskey nguyên chất hay uống với đá ạ?' }
  ];

  // Load mistakes & custom words
  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        setLoadingMistakes(true);
        const m = await getUserMistakes(currentUser.uid);
        setMistakes(m);
        const cw = await getUserCustomWords(currentUser.uid);
        setCustomWords(cw);
        setLoadingMistakes(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Handle resolve mistake
  const handleResolveMistake = async (id: string) => {
    if (currentUser) {
      await resolveUserMistake(currentUser.uid, id);
      setMistakes(prev => prev.filter(item => item.id !== id));
    }
  };

  // Handle add custom word
  const handleAddCustomWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim() || !newMeaning.trim() || !currentUser) return;
    await addUserCustomWord(currentUser.uid, {
      term: newTerm.trim(),
      meaningVi: newMeaning.trim(),
      exampleEn: newExample.trim()
    });
    const cw = await getUserCustomWords(currentUser.uid);
    setCustomWords(cw);
    setNewTerm('');
    setNewMeaning('');
    setNewExample('');
    setShowAddWordModal(false);
  };

  const handleDeleteCustomWord = async (id: string) => {
    if (currentUser) {
      await deleteUserCustomWord(currentUser.uid, id);
      setCustomWords(prev => prev.filter(w => w.id !== id));
    }
  };

  // Speed Quiz logic
  const startSpeedQuiz = () => {
    const shuffled = [...seedVocabulary].sort(() => 0.5 - Math.random()).slice(0, 15);
    setQuizQuestions(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizTimeLeft(45);
    setQuizRunning(true);
    prepareQuizOptions(shuffled[0], shuffled);
  };

  const prepareQuizOptions = (target: VocabularyItem, all: VocabularyItem[]) => {
    const distractors = all
      .filter(w => w.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.meaningVi);
    const opts = [target.meaningVi, ...distractors].sort(() => 0.5 - Math.random());
    setQuizOptions(opts);
  };

  useEffect(() => {
    if (!quizRunning) return;
    if (quizTimeLeft <= 0) {
      setQuizRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setQuizTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizRunning, quizTimeLeft]);

  const handleAnswerQuiz = (selectedMeaning: string) => {
    const current = quizQuestions[quizIndex];
    if (selectedMeaning === current.meaningVi) {
      setQuizScore(prev => prev + 1);
    }
    if (quizIndex < quizQuestions.length - 1) {
      const nextIdx = quizIndex + 1;
      setQuizIndex(nextIdx);
      prepareQuizOptions(quizQuestions[nextIdx], quizQuestions);
    } else {
      setQuizRunning(false);
    }
  };

  // Speaking lab
  const handleStartSpeakingLab = () => {
    const target = speakingPrompts[speakingIndex].en;
    setIsListening(true);
    setSpokenTranscript('');
    setSpeakingScore(null);

    const recognizer = createSpeechRecognizer(
      res => {
        setSpokenTranscript(res.transcript);
        if (res.isFinal) {
          setIsListening(false);
          const ratio = calculateSimilarity(res.transcript, target);
          setSpeakingScore(Math.round(ratio * 100));
        }
      },
      err => {
        setIsListening(false);
      },
      () => setIsListening(false)
    );

    recognizer?.start();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Trung tâm Luyện tập & Sửa sai
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Luyện phản xạ giọng nói, sổ lỗi sai cá nhân hóa và mini-game Speed Quiz 45 giây.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('mistakes')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'mistakes'
              ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Sổ lỗi sai ({mistakes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('speed_quiz')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'speed_quiz'
              ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Speed Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('speaking')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'speaking'
              ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Mic className="w-4 h-4 text-sky-500" />
          <span>Speaking Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('my_words')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'my_words'
              ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <BookMarked className="w-4 h-4 text-emerald-500" />
          <span>Sổ từ riêng ({customWords.length})</span>
        </button>
      </div>

      {/* ==========================================
          TAB 1: MISTAKE NOTEBOOK (SỔ LỖI SAI)
      ========================================== */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-red-700 dark:text-red-400">
                Các câu trả lời sai trong bài học sẽ tự động được lưu vào đây.
              </span>
              <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                Khi bạn đã nắm vững giải thích, hãy bấm "Đã hiểu" để gỡ bỏ khỏi sổ lỗi sai.
              </p>
            </div>
          </div>

          {mistakes.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Tuyệt vời! Hiện tại bạn không có lỗi sai nào tồn đọng.
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Hãy tiếp tục làm bài tập trong các Unit để rèn luyện nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mistakes.map(m => (
                <div
                  key={m.id}
                  className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
                >
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {m.promptEn}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{m.promptVi}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300">
                      <span className="font-bold block text-[10px] uppercase">Câu bạn đã chọn/gõ:</span>
                      <span>{String(m.userAnswer)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300">
                      <span className="font-bold block text-[10px] uppercase">Đáp án chuẩn:</span>
                      <span>{String(m.correctAnswer)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl leading-relaxed">
                    💡 <span className="font-bold">Giải thích:</span> {m.explanationVi}
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleResolveMistake(m.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Đã hiểu, gỡ bỏ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: SPEED QUIZ MINI-GAME
      ========================================== */}
      {activeTab === 'speed_quiz' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
          {!quizRunning ? (
            <div className="max-w-md mx-auto space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
                <Timer className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                Thử thách Speed Quiz 45 Giây
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Đoán đúng nghĩa của càng nhiều từ vựng F&B càng tốt trước khi đồng hồ điểm 0! Rèn luyện phản xạ dịch nghĩa tức thì khi đứng trước khách.
              </p>

              {quizScore > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                  <span className="text-xs font-bold text-amber-800">Điểm số lượt vừa rồi:</span>
                  <div className="text-3xl font-black text-amber-600 mt-1">{quizScore} câu đúng!</div>
                </div>
              )}

              <button
                onClick={startSpeedQuiz}
                className="px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-lg shadow-amber-600/30 active:scale-95 transition-all"
              >
                Bắt đầu đếm ngược
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6">
              {/* Timer Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-red-600 font-black text-sm">
                  <Timer className="w-4 h-4 animate-spin" />
                  <span>{quizTimeLeft}s</span>
                </div>
                <div className="text-xs font-bold text-neutral-400">
                  Điểm: <span className="text-primary-600 font-black text-base">{quizScore}</span>
                </div>
              </div>

              {/* Target Term */}
              <div className="py-4">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Nghĩa của từ này là gì?
                </span>
                <h3 className="text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                  {quizQuestions[quizIndex]?.term}
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  {quizQuestions[quizIndex]?.ipa}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {quizOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerQuiz(opt)}
                    className="p-3.5 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 3: SPEAKING LAB
      ========================================== */}
      {activeTab === 'speaking' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-700 uppercase">
              Luyện phát âm câu hoàn chỉnh
            </span>
            <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100 mt-2">
              Luyện nói câu số {speakingIndex + 1}/{speakingPrompts.length}
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100">
                "{speakingPrompts[speakingIndex].en}"
              </h3>
              <AudioButton text={speakingPrompts[speakingIndex].en} size="md" showSlowToggle={true} />
            </div>
            <p className="text-xs text-neutral-500">
              → {speakingPrompts[speakingIndex].vi}
            </p>
          </div>

          {/* Voice Input */}
          <div className="flex flex-col items-center gap-3 py-4">
            <button
              onClick={handleStartSpeakingLab}
              disabled={isListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isListening
                  ? 'bg-red-500 text-white mic-recording scale-110'
                  : 'bg-sky-600 hover:bg-sky-700 text-white active:scale-95'
              }`}
            >
              <Mic className="w-7 h-7" />
            </button>
            <span className="text-xs font-semibold text-neutral-500">
              {isListening ? 'Đang lắng nghe bạn nói...' : 'Bấm micro để bắt đầu nói'}
            </span>
          </div>

          {spokenTranscript && (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border text-xs space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-bold">Máy nghe được:</span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                "{spokenTranscript}"
              </p>
              {speakingScore !== null && (
                <div className={`mt-2 font-bold text-sm ${speakingScore >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  Điểm phát âm: {speakingScore}% {speakingScore >= 70 ? '🎉 Rất chuẩn xác!' : '💪 Hãy thử đọc chậm và rõ từng âm hơn nhé!'}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <button
              disabled={speakingIndex === 0}
              onClick={() => {
                setSpeakingIndex(prev => prev - 1);
                setSpokenTranscript('');
                setSpeakingScore(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 disabled:opacity-40"
            >
              ← Câu trước
            </button>
            <button
              disabled={speakingIndex === speakingPrompts.length - 1}
              onClick={() => {
                setSpeakingIndex(prev => prev + 1);
                setSpokenTranscript('');
                setSpeakingScore(null);
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold disabled:opacity-40"
            >
              Câu tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: MY WORD LIST (SỔ TỪ RIÊNG)
      ========================================== */}
      {activeTab === 'my_words' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Ghi chép lại các từ vựng mới bạn nghe được từ khách tại quán của mình.
            </p>
            <button
              onClick={() => setShowAddWordModal(true)}
              className="px-3.5 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm từ mới</span>
            </button>
          </div>

          {customWords.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200">
              <BookMarked className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Sổ từ riêng của bạn đang trống.
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Bấm "Thêm từ mới" ở góc phải để tạo danh sách từ vựng cá nhân nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {customWords.map(w => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm text-neutral-900 dark:text-neutral-100">
                        {w.term}
                      </h3>
                      <AudioButton text={w.term} size="sm" />
                    </div>
                    <p className="text-xs font-semibold text-primary-600 mt-1">
                      {w.meaningVi}
                    </p>
                    {w.exampleEn && (
                      <p className="text-[11px] text-neutral-500 italic mt-1">
                        "{w.exampleEn}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCustomWord(w.id)}
                    className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                    title="Xóa từ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Word Modal */}
          {showAddWordModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mb-3">
                  Thêm từ vựng vào sổ tay
                </h3>
                <form onSubmit={handleAddCustomWord} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Thuật ngữ tiếng Anh (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Decanter"
                      value={newTerm}
                      onChange={e => setNewTerm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Nghĩa tiếng Việt (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="Bình thở rượu vang"
                      value={newMeaning}
                      onChange={e => setNewMeaning(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Ví dụ thực tế (tùy chọn)</label>
                    <input
                      type="text"
                      placeholder="Pour the wine into the decanter"
                      value={newExample}
                      onChange={e => setNewExample(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddWordModal(false)}
                      className="px-3.5 py-2 text-xs font-medium text-neutral-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 shadow-sm"
                    >
                      Lưu từ vựng
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

