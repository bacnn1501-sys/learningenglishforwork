import React, { useState } from 'react';
import { Flag, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'word' | 'lesson' | 'general';
  targetId?: string;
  targetTitle?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle
}) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitFeedback({
        userId: currentUser?.uid || 'guest_user',
        userEmail: currentUser?.email || 'guest@learningenglishforwork.local',
        targetType,
        targetId: targetId || '',
        targetTitle: targetTitle || '',
        message: message.trim()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Lỗi gửi phản hồi. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">Báo lỗi nội dung</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {targetTitle ? `Nội dung: ${targetTitle}` : 'Góp ý để hoàn thiện bài học tốt hơn'}
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2 animate-bounce" />
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">Cảm ơn bạn đã đóng góp!</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Ban biên tập sẽ kiểm tra và cập nhật trong thời gian sớm nhất.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Mô tả chi tiết lỗi sai hoặc đề xuất cải thiện:
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                required
                maxLength={1000}
                placeholder="Ví dụ: Lỗi chính tả ở ví dụ số 2, hoặc phát âm chưa tự nhiên, nghĩa tiếng Việt chưa sát ngữ cảnh quầy bar..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
              <span className="text-[10px] text-neutral-400 block text-right mt-1">
                {message.length}/1000 ký tự
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="px-4 py-2 text-xs font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Đang gửi...' : 'Gửi báo lỗi'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

