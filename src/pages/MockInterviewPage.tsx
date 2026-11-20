import React, { useState } from 'react';
import {
  HelpCircle,
  Volume2,
  Sparkles,
  CheckCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { AudioButton } from '../components/common/AudioButton';

interface InterviewQuestion {
  questionEn: string;
  questionVi: string;
  category: 'introduction' | 'customer_service' | 'conflict' | 'knowledge';
  sampleAnswerEn: string;
  sampleAnswerVi: string;
  keyVocabulary: string[];
  tipsVi: string;
}

const interviewQuestions: InterviewQuestion[] = [
  {
    questionEn: 'Tell me about yourself and your experience in the hospitality industry.',
    questionVi: 'Hãy giới thiệu bản thân và kinh nghiệm làm việc trong ngành dịch vụ của bạn.',
    category: 'introduction',
    sampleAnswerEn: 'I have been working as a food and beverage attendant for two years in a fast-paced dining environment. I take immense pride in delivering genuine hospitality, anticipating guest needs, and keeping high service standards under pressure.',
    sampleAnswerVi: 'Tôi đã làm việc với tư cách là nhân viên phục vụ F&B được 2 năm trong môi trường năng động. Tôi luôn tự hào mang lại sự hiếu khách chân thành, đón đầu nhu cầu của khách và giữ vững tiêu chuẩn phục vụ cao dưới áp lực.',
    keyVocabulary: ['genuine hospitality', 'anticipating guest needs', 'high service standards', 'fast-paced environment'],
    tipsVi: 'Nêu bật thái độ tích cực, kinh nghiệm thực tế và sự yêu thích việc đem lại niềm vui cho thực khách.'
  },
  {
    questionEn: 'How do you handle an extremely angry guest complaining about a delayed meal?',
    questionVi: 'Bạn xử lý thế nào khi gặp một vị khách đang vô cùng tức giận vì món bị trễ?',
    category: 'conflict',
    sampleAnswerEn: 'I always adhere to the L.A.S.T principle: Listen attentively without interrupting, Apologize sincerely for the inconvenience, Solve the issue immediately by expediting the kitchen order, and Thank the guest for their patience and feedback.',
    sampleAnswerVi: 'Tôi luôn tuân thủ nguyên tắc L.A.S.T: Lắng nghe chăm chú không ngắt lời, Xin lỗi chân thành về sự bất tiện, Giải quyết vấn đề bằng cách giục bếp ra món ngay, và Cảm ơn sự kiên nhẫn cùng góp ý của khách.',
    keyVocabulary: ['L.A.S.T principle', 'listen attentively', 'sincerely apologize', 'expedite the order'],
    tipsVi: 'Nhà tuyển dụng muốn thấy bạn giữ được bình tĩnh, thấu cảm và không tranh cãi hay đổ lỗi cho bộ phận bếp.'
  },
  {
    questionEn: 'What would you do if a diner tells you they have a life-threatening peanut allergy?',
    questionVi: 'Bạn sẽ làm gì nếu thực khách thông báo họ bị dị ứng đậu phộng nguy hiểm tính mạng?',
    category: 'customer_service',
    sampleAnswerEn: 'I would immediately verify all ingredients with the head chef, clearly flag "ALLERGY" on the kitchen ticket, ensure separate sanitized utensils are used, and personally confirm the safety of the dish before serving it to the table.',
    sampleAnswerVi: 'Tôi sẽ ngay lập tức đối chiếu nguyên liệu với bếp trưởng, đánh dấu hoa "ALLERGY" trên phiếu order, đảm bảo dùng dụng cụ tiệt trùng riêng biệt và đích thân xác nhận độ an toàn của đĩa món trước khi mang ra bàn.',
    keyVocabulary: ['life-threatening allergy', 'verify ingredients', 'flag on kitchen ticket', 'separate sanitized utensils'],
    tipsVi: 'An toàn tính mạng là ưu tiên số 1. Luôn nhấn mạnh quy trình xác nhận 2 lần với bếp trưởng.'
  },
  {
    questionEn: 'Why do you want to join our hotel/restaurant team?',
    questionVi: 'Tại sao bạn lại muốn gia nhập đội ngũ nhà hàng/khách sạn của chúng tôi?',
    category: 'introduction',
    sampleAnswerEn: 'Your establishment has a stellar reputation for culinary excellence and exceptional guest care. I am eager to contribute my strong work ethic and passion for gastronomy while growing alongside top industry professionals.',
    sampleAnswerVi: 'Nhà hàng của quý vị có danh tiếng xuất sắc về ẩm thực đỉnh cao và sự chăm sóc khách hàng vượt trội. Tôi rất khao khát được cống hiến sự chăm chỉ và niềm đam mê ẩm thực của mình, đồng thời học hỏi từ những chuyên gia hàng đầu.',
    keyVocabulary: ['stellar reputation', 'culinary excellence', 'exceptional guest care', 'strong work ethic'],
    tipsVi: 'Tìm hiểu trước về phong cách ẩm thực và thế mạnh của nhà hàng để lồng ghép vào câu trả lời.'
  }
];

export const MockInterviewPage: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = interviewQuestions[selectedIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Luyện Phỏng vấn xin việc F&B
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Bộ câu hỏi phỏng vấn tuyển dụng chuẩn quốc tế kèm câu trả lời mẫu ghi điểm và hướng dẫn phát âm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Questions list */}
        <div className="space-y-2">
          {interviewQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                selectedIdx === idx
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'
              }`}
            >
              <span className="text-[10px] text-neutral-400 block mb-0.5">Câu hỏi {idx + 1}:</span>
              <span className="line-clamp-2">{q.questionVi}</span>
            </button>
          ))}
        </div>

        {/* Selected Answer & Audio */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 uppercase">
                Câu hỏi của Nhà tuyển dụng
              </span>
              <div className="flex items-start justify-between gap-3 mt-2">
                <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                  "{current.questionEn}"
                </h2>
                <AudioButton text={current.questionEn} size="sm" />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                → {current.questionVi}
              </p>
            </div>

            {/* Model Answer */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider">
                  Gợi ý câu trả lời mẫu ghi điểm:
                </span>
                <AudioButton text={current.sampleAnswerEn} size="sm" showSlowToggle={true} />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-relaxed italic">
                "{current.sampleAnswerEn}"
              </p>
              <p className="text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-700 pt-1.5">
                → {current.sampleAnswerVi}
              </p>
            </div>

            {/* Key Vocabulary */}
            <div>
              <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1.5">
                Cụm từ vàng (Key Vocabulary):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {current.keyVocabulary.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-semibold"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Interviewer Tip */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Mẹo tâm lý phỏng vấn: </span>
              {current.tipsVi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

