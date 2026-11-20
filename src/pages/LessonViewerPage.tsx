import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Volume2,
  Volume1,
  Mic,
  MicOff,
  Check,
  X,
  Sparkles,
  Award,
  ArrowRight,
  RotateCcw,
  Flag,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLessonById, getExercisesByLesson, saveLessonCompletion, saveUserMistake } from '../services/db';
import { seedLessons, seedExercises, seedVocabulary } from '../data/seedData';
import { Lesson, ExerciseItem, VocabularyItem } from '../types';
import { AudioButton } from '../components/common/AudioButton';
import { FeedbackModal } from '../components/common/FeedbackModal';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';
import { calculateSimilarity, isAnswerAcceptable } from '../utils/text';

export const LessonViewerPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { currentUser, isGuest } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Exercise runner states
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<any>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [isLessonCompleted, setIsLessonCompleted] = useState<boolean>(false);

  // Speaking state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [speakingScorePercent, setSpeakingScorePercent] = useState<number | null>(null);

  // Feedback modal
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (!lessonId) return;
      setLoading(true);
      try {
        let l = await getLessonById(lessonId);
        if (!l) {
          l = seedLessons.find(item => item.id === lessonId) || null;
        }
        setLesson(l);

        // Fetch exercises
        let exList = await getExercisesByLesson(lessonId);
        if (exList.length === 0) {
          exList = seedExercises.filter(ex => ex.lessonId === lessonId || ex.trackId === l?.trackId);
        }
        setExercises(exList);

        // If vocabulary lesson, populate sample words
        if (l?.type === 'vocabulary') {
          const matchedWords = seedVocabulary.filter(v => v.track === l?.trackId).slice(0, 8);
          setVocabList(matchedWords.length > 0 ? matchedWords : seedVocabulary.slice(0, 8));
        }
      } catch (e) {
        console.error('Error loading lesson:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [lessonId]);

  // Voice recognizer for speaking exercises
  const handleStartSpeaking = (targetSentence: string) => {
    if (isListening) return;
    setIsListening(true);
    setSpokenTranscript('');
    setSpeakingScorePercent(null);

    const recognizer = createSpeechRecognizer(
      (result) => {
        setSpokenTranscript(result.transcript);
        if (result.isFinal) {
          setIsListening(false);
          const ratio = calculateSimilarity(result.transcript, targetSentence);
          const pct = Math.round(ratio * 100);
          setSpeakingScorePercent(pct);
          setUserSelectedAnswer(result.transcript);
        }
      },
      (err) => {
        setIsListening(false);
        console.warn(err);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognizer.start();
    }
  };

  // Check answer for current exercise
  const handleCheckAnswer = async () => {
    if (!exercises[currentStep]) return;
    const currentEx = exercises[currentStep];
    let correct = false;

    if (currentEx.type === 'multiple_choice' || currentEx.type === 'listening') {
      correct = userSelectedAnswer === currentEx.correctAnswer;
    } else if (currentEx.type === 'fill_in_the_blank') {
      correct = String(userSelectedAnswer).trim().toLowerCase() === String(currentEx.correctAnswer).trim().toLowerCase();
    } else if (currentEx.type === 'translation') {
      correct = isAnswerAcceptable(String(userSelectedAnswer || ''), currentEx.correctAnswer);
    } else if (currentEx.type === 'speaking') {
      correct = (speakingScorePercent || 0) >= 65;
    } else if (currentEx.type === 'reorder') {
      const userArr = Array.isArray(userSelectedAnswer) ? userSelectedAnswer : [];
      const correctArr = Array.isArray(currentEx.correctAnswer) ? currentEx.correctAnswer : [];
      correct = JSON.stringify(userArr) === JSON.stringify(correctArr);
    } else if (currentEx.type === 'roleplay') {
      correct = userSelectedAnswer === currentEx.correctAnswer;
    } else {
      correct = true;
    }

    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setUserScore(prev => prev + 1);
    } else {
      // Save mistake for user's mistake notebook
      if (currentUser) {
        await saveUserMistake(currentUser.uid, {
          exerciseId: currentEx.id,
          userAnswer: userSelectedAnswer || 'Chưa trả lời',
          correctAnswer: currentEx.correctAnswer,
          promptEn: currentEx.promptEn,
          promptVi: currentEx.promptVi,
          explanationVi: currentEx.explanationVi,
          resolved: false,
          createdAt: Date.now()
        });
      }
    }
  };

  // Next question or complete lesson
  const handleNextStep = async () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(prev => prev + 1);
      setUserSelectedAnswer(null);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
      setSpokenTranscript('');
      setSpeakingScorePercent(null);
    } else {
      // Finish Lesson
      const finalScorePct = exercises.length > 0 ? Math.round(((userScore + (isAnswerCorrect ? 1 : 0)) / exercises.length) * 100) : 100;
      setIsLessonCompleted(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Save completion to Firestore
      if (currentUser && lesson) {
        await saveLessonCompletion({
          uid: currentUser.uid,
          lessonId: lesson.id,
          unitId: lesson.unitId,
          score: finalScorePct,
          earnedXp: lesson.xpReward || 30,
          isFirstCompletion: true
        });
      } else if (isGuest && lesson) {
        // Save in localStorage for Guest
        const raw = localStorage.getItem('fb_english_guest_progress') || '{}';
        const parsed = JSON.parse(raw);
        parsed[lesson.id] = {
          lessonId: lesson.id,
          unitId: lesson.unitId,
          completed: true,
          score: finalScorePct,
          completedAt: Date.now()
        };
        localStorage.setItem('fb_english_guest_progress', JSON.stringify(parsed));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
        <p className="text-xs text-neutral-500">Đang chuẩn bị nội dung bài học...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 text-center">
        <p className="text-sm font-bold">Không tìm thấy bài học.</p>
        <Link to="/roadmap" className="mt-4 inline-block text-xs font-bold text-primary-600">
          ← Quay lại Lộ trình
        </Link>
      </div>
    );
  }

  // ==========================================
  // VIEW: VOCABULARY LIST LESSON
  // ==========================================
  if (lesson.type === 'vocabulary') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/roadmap')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trở về</span>
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Báo lỗi</span>
          </button>
        </div>

        <div className="text-center">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 uppercase">
            Học Từ vựng trọng tâm
          </span>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-2">
            {lesson.titleVi}
          </h1>
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
            {lesson.titleEn}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {vocabList.map(v => (
            <div
              key={v.id}
              className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                      {v.term}
                    </h3>
                    <span className="text-xs font-mono text-neutral-400">
                      {v.ipa}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 uppercase">
                      {v.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-primary-700 dark:text-primary-400 mt-1">
                    {v.meaningVi}
                  </p>
                </div>
                <AudioButton text={v.term} showSlowToggle={true} />
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-2xl space-y-1">
                <p className="italic text-neutral-500">"{v.exampleEn}"</p>
                <p className="font-medium text-neutral-700 dark:text-neutral-200">→ {v.exampleVi}</p>
              </div>

              {v.culturalNotes && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
                  <span className="font-bold">Mẹo thực tế: </span>
                  {v.culturalNotes}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => navigate('/roadmap')}
            className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Hoàn thành bài học</span>
            <Check className="w-4 h-4" />
          </button>
        </div>

        <FeedbackModal
          isOpen={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          targetType="lesson"
          targetId={lesson.id}
          targetTitle={lesson.titleVi}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW: DIALOGUE LESSON
  // ==========================================
  if (lesson.type === 'dialogue') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/roadmap')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trở về</span>
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Báo lỗi</span>
          </button>
        </div>

        <div className="text-center">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 uppercase">
            Hội thoại thực tế
          </span>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-2">
            {lesson.titleVi}
          </h1>
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
            {lesson.titleEn}
          </p>
        </div>

        {/* Dialogue Script */}
        <div className="space-y-4">
          {lesson.dialogue?.map((line, idx) => {
            const isStaff = line.speaker === 'staff';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isStaff ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 text-white shadow-xs ${
                    isStaff ? 'bg-primary-600' : 'bg-neutral-600'
                  }`}
                >
                  {isStaff ? 'Bạn' : 'Khách'}
                </div>

                <div
                  className={`max-w-[80%] p-4 rounded-3xl ${
                    isStaff
                      ? 'bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-900 rounded-tr-none'
                      : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                      {line.textEn}
                    </p>
                    <AudioButton text={line.textEn} size="sm" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 border-t border-neutral-100 dark:border-neutral-800/80 pt-1">
                    {line.textVi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => navigate('/roadmap')}
            className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Hoàn thành bài hội thoại</span>
            <Check className="w-4 h-4" />
          </button>
        </div>

        <FeedbackModal
          isOpen={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          targetType="lesson"
          targetId={lesson.id}
          targetTitle={lesson.titleVi}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW: EXERCISE RUNNER (9 EXERCISE TYPES)
  // ==========================================
  if (isLessonCompleted) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
          Xuất sắc hoàn thành!
        </h2>
        <p className="text-xs text-neutral-500">
          Bạn vừa làm chủ các kỹ năng giao tiếp trong bài:
          <span className="block font-bold text-neutral-800 dark:text-neutral-200 mt-1">
            {lesson.titleVi}
          </span>
        </p>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-around">
          <div>
            <div className="text-lg font-black text-neutral-900 dark:text-neutral-100">
              +{lesson.xpReward} XP
            </div>
            <p className="text-[10px] text-neutral-400">Điểm kinh nghiệm</p>
          </div>
          <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700" />
          <div>
            <div className="text-lg font-black text-emerald-600">
              {exercises.length > 0 ? Math.round((userScore / exercises.length) * 100) : 100}%
            </div>
            <p className="text-[10px] text-neutral-400">Độ chính xác</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/roadmap')}
          className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all"
        >
          Trở lại Lộ trình
        </button>
      </div>
    );
  }

  const currentExercise = exercises[currentStep];
  if (!currentExercise) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 text-center">
        <p className="text-xs text-neutral-500">Không có bài tập cho bài học này.</p>
        <button onClick={() => navigate('/roadmap')} className="mt-4 text-xs font-bold text-primary-600">
          Quay lại Lộ trình
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Exercise Progress Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/roadmap')}
          className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
        >
          ✕ Thoát
        </button>

        <div className="flex-1 mx-4 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / exercises.length) * 100}%` }}
          />
        </div>

        <span className="text-xs font-bold text-neutral-500">
          {currentStep + 1}/{exercises.length}
        </span>
      </div>

      {/* Question Prompt */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {currentExercise.type.replace(/_/g, ' ')}
        </span>
        <h2 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100">
          {currentExercise.promptEn}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {currentExercise.promptVi}
        </p>
      </div>

      {/* Audio Prompts (if listening exercise) */}
      {currentExercise.audioText && (
        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center gap-3">
          <AudioButton text={currentExercise.audioText} size="lg" showSlowToggle={true} />
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Bấm để nghe phát âm câu hỏi
          </span>
        </div>
      )}

      {/* ==========================================
          DYNAMIC EXERCISE BODY BY TYPE
      ========================================== */}

      {/* 1. Multiple Choice / Listening Options */}
      {(currentExercise.type === 'multiple_choice' || currentExercise.type === 'listening') && (
        <div className="space-y-2.5">
          {currentExercise.options?.map((opt, idx) => {
            const isSelected = userSelectedAnswer === opt;
            return (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => setUserSelectedAnswer(opt)}
                className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:border-neutral-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Fill in the Blank */}
      {currentExercise.type === 'fill_in_the_blank' && (
        <div className="space-y-3">
          {currentExercise.options && currentExercise.options.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentExercise.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={isAnswerChecked}
                  onClick={() => setUserSelectedAnswer(opt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    userSelectedAnswer === opt
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              disabled={isAnswerChecked}
              placeholder="Nhập từ còn thiếu..."
              value={userSelectedAnswer || ''}
              onChange={e => setUserSelectedAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          )}
        </div>
      )}

      {/* 3. Translation */}
      {currentExercise.type === 'translation' && (
        <div className="space-y-3">
          <textarea
            rows={3}
            disabled={isAnswerChecked}
            placeholder="Gõ bản dịch tiếng Anh của bạn..."
            value={userSelectedAnswer || ''}
            onChange={e => setUserSelectedAnswer(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      )}

      {/* 4. Speaking Practice (Web Speech Recognition) */}
      {currentExercise.type === 'speaking' && (
        <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
          <p className="text-xs text-neutral-500">
            Bấm micro và đọc to rõ ràng câu mẫu:
          </p>

          <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold flex items-center justify-between">
            <span>"{currentExercise.audioText || currentExercise.promptEn}"</span>
            <AudioButton text={currentExercise.audioText || currentExercise.promptEn} size="sm" />
          </div>

          {/* Voice Input Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => handleStartSpeaking(currentExercise.audioText || currentExercise.promptEn)}
              disabled={isListening || isAnswerChecked}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                isListening
                  ? 'bg-red-500 text-white mic-recording scale-110'
                  : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
              }`}
            >
              {isListening ? <Mic className="w-7 h-7 animate-pulse" /> : <Mic className="w-7 h-7" />}
            </button>
            <span className="text-[11px] font-medium text-neutral-500">
              {isListening ? 'Đang lắng nghe giọng bạn...' : 'Bấm để nói'}
            </span>
          </div>

          {spokenTranscript && (
            <div className="text-left p-3 rounded-xl bg-white dark:bg-neutral-900 border text-xs">
              <span className="text-neutral-400 block text-[10px]">Giọng bạn:</span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                "{spokenTranscript}"
              </p>
              {speakingScorePercent !== null && (
                <div className="mt-1 text-xs font-bold text-primary-600">
                  Độ tương đồng: {speakingScorePercent}%
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. Role-play Interactive Step */}
      {currentExercise.type === 'roleplay' && currentExercise.rolePlaySteps && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
              Khách nói:
            </span>
            <p className="font-semibold text-neutral-800 dark:text-neutral-100">
              "{currentExercise.rolePlaySteps[0].guestSaysEn}"
            </p>
            <p className="text-neutral-500 text-[11px] mt-0.5">
              → {currentExercise.rolePlaySteps[0].guestSaysVi}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Bạn sẽ trả lời khách như thế nào?
            </span>
            {currentExercise.rolePlaySteps[0].options.map((opt, idx) => (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => setUserSelectedAnswer(opt.textEn)}
                className={`w-full text-left p-3.5 rounded-2xl border-2 text-xs font-medium transition-all ${
                  userSelectedAnswer === opt.textEn
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                }`}
              >
                <p className="font-semibold">{opt.textEn}</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">{opt.textVi}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Answer Validation Feedback Banner */}
      {isAnswerChecked && (
        <div
          className={`p-4 rounded-2xl border animate-fade-in ${
            isAnswerCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-100'
              : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-900 dark:text-red-100'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm">
            {isAnswerCorrect ? (
              <>
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Chính xác! Tuyệt vời!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                <span>Chưa chuẩn xác rồi!</span>
              </>
            )}
          </div>

          <p className="text-xs mt-2 leading-relaxed opacity-90">
            {currentExercise.explanationVi}
          </p>

          {!isAnswerCorrect && currentExercise.correctAnswer && (
            <div className="mt-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Đáp án đúng:{' '}
              <span className="underline">
                {typeof currentExercise.correctAnswer === 'object'
                  ? JSON.stringify(currentExercise.correctAnswer)
                  : String(currentExercise.correctAnswer)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Báo lỗi câu này</span>
        </button>

        {!isAnswerChecked ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!userSelectedAnswer && currentExercise.type !== 'speaking'}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md disabled:opacity-50 active:scale-95 transition-all"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <button
            onClick={handleNextStep}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>{currentStep < exercises.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        targetType="lesson"
        targetId={lesson.id}
        targetTitle={currentExercise.promptEn}
      />
    </div>
  );
};

