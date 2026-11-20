import React, { useState, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { getPublishedCultureNotes } from '../services/db';
import { seedCultureNotes } from '../data/seedData';
import { CultureNoteItem } from '../types';

export const CultureEtiquettePage: React.FC = () => {
  const [notes, setNotes] = useState<CultureNoteItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function loadNotes() {
      try {
        let n = await getPublishedCultureNotes();
        if (n.length === 0) n = seedCultureNotes;
        setNotes(n);
      } catch (e) {
        setNotes(seedCultureNotes);
      }
    }
    loadNotes();
  }, []);

  const filteredNotes = notes.filter(n => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Văn hóa & Nghi thức Quốc tế (Etiquette)
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Quy chuẩn văn hóa tiền tip, tôn giáo ăn kiêng (Halal, Kosher), chống sốc phản vệ dị ứng và nghi thức bàn tiệc.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          Tất cả chủ đề
        </button>
        <button
          onClick={() => setActiveCategory('tipping')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'tipping'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          Tiền Tip & Phí Dịch vụ
        </button>
        <button
          onClick={() => setActiveCategory('dietary')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'dietary'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          Dị ứng & Halal / Kosher
        </button>
      </div>

      {/* Notes Grid */}
      <div className="space-y-6">
        {filteredNotes.map(item => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                  {item.targetCountryOrCulture}
                </span>
                <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-100 mt-1">
                  {item.titleVi}
                </h2>
                <h3 className="text-xs font-semibold text-primary-600">
                  {item.titleEn}
                </h3>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {item.contentVi}
            </p>

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* DOs */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>NÊN LÀM (DOs)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {item.dos.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONTs */}
              <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 space-y-2">
                <h4 className="text-xs font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <X className="w-4 h-4 text-red-600" />
                  <span>TRÁNH LÀM (DON'Ts)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {item.donts.map((dn, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{dn}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

