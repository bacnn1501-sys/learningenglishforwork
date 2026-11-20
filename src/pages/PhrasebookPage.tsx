import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Copy,
  Check,
  Search,
  BookOpen,
  Wine,
  Coffee,
  AlertCircle,
  CreditCard,
  DoorOpen
} from 'lucide-react';
import { getPublishedPhrases } from '../services/db';
import { seedPhrases } from '../data/seedData';
import { PhraseCategory } from '../types';
import { AudioButton } from '../components/common/AudioButton';

export const PhrasebookPage: React.FC = () => {
  const [phrases, setPhrases] = useState<PhraseCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    async function loadPhrases() {
      try {
        let p = await getPublishedPhrases();
        if (p.length === 0) p = seedPhrases;
        setPhrases(p);
      } catch (e) {
        setPhrases(seedPhrases);
      }
    }
    loadPhrases();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredCategories = phrases.filter(cat => {
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Mẫu câu giao tiếp nhanh (Phrasebook)
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Cứu cánh tức thì trong ca làm việc. Tra cứu tình huống, nghe phát âm và copy dùng ngay (hỗ trợ ngoại tuyến).
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          Tất cả tình huống
        </button>
        {phrases.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {cat.situationVi}
          </button>
        ))}
      </div>

      {/* Phrases List */}
      <div className="space-y-6">
        {filteredCategories.map(cat => {
          const matchedPhrases = cat.phrases.filter(p => {
            if (!searchTerm.trim()) return true;
            const s = searchTerm.toLowerCase();
            return p.en.toLowerCase().includes(s) || p.vi.toLowerCase().includes(s);
          });

          if (matchedPhrases.length === 0) return null;

          return (
            <div
              key={cat.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                <div>
                  <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">
                    {cat.situationVi}
                  </h2>
                  <p className="text-xs text-primary-600 font-semibold">
                    {cat.situationEn}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 uppercase">
                  {cat.category}
                </span>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {matchedPhrases.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-start justify-between gap-3 group">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                        {item.en}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        → {item.vi}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <AudioButton text={item.en} size="sm" showSlowToggle={true} />
                      <button
                        onClick={() => handleCopy(item.en)}
                        className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                        title="Sao chép câu này"
                      >
                        {copiedText === item.en ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

