import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  Filter,
  Heart,
  Volume2,
  BookOpen,
  Sparkles,
  ChevronDown,
  Clock,
  Flag,
  Loader2,
  Bookmark
} from 'lucide-react';
import { getPublishedVocabulary, getUserFavorites, toggleUserFavorite } from '../services/db';
import { seedVocabulary } from '../data/seedData';
import { VocabularyItem, CEFRLevel } from '../types';
import { AudioButton } from '../components/common/AudioButton';
import { FeedbackModal } from '../components/common/FeedbackModal';
import { removeVietnameseAccents } from '../utils/text';

export const VocabularyDictionaryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');

  // Detail Modal & Feedback Modal
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [feedbackWord, setFeedbackWord] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    async function loadVocab() {
      setLoading(true);
      try {
        const { items } = await getPublishedVocabulary({ pageSize: 120 });
        const finalItems = items.length > 0 ? items : seedVocabulary;
        setVocabList(finalItems);

        if (currentUser) {
          const favs = await getUserFavorites(currentUser.uid);
          setFavorites(favs);
        } else {
          const localFavs = localStorage.getItem('fb_vocab_favs');
          if (localFavs) setFavorites(JSON.parse(localFavs));
        }
      } catch (e) {
        console.error('Error fetching vocabulary:', e);
        setVocabList(seedVocabulary);
      } finally {
        setLoading(false);
      }
    }
    loadVocab();
  }, [currentUser]);

  const handleToggleFavorite = async (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favorites.includes(wordId);
    const updated = isFav ? favorites.filter(id => id !== wordId) : [...favorites, wordId];
    setFavorites(updated);

    if (currentUser) {
      await toggleUserFavorite(currentUser.uid, wordId, isFav);
    } else {
      localStorage.setItem('fb_vocab_favs', JSON.stringify(updated));
    }
  };

  // Filtered & Searched Vocabulary List
  const filteredWords = useMemo(() => {
    const termClean = removeVietnameseAccents(searchTerm.trim().toLowerCase());

    return vocabList.filter(item => {
      // Tab filter
      if (activeTab === 'favorites' && !favorites.includes(item.id)) {
        return false;
      }

      // Track filter
      if (selectedTrack !== 'all' && item.track !== selectedTrack) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }

      // Search matching (accent-insensitive on term, meaningVi, definition, tags)
      if (termClean) {
        const matchTerm = removeVietnameseAccents(item.term.toLowerCase()).includes(termClean);
        const matchMeaning = removeVietnameseAccents(item.meaningVi.toLowerCase()).includes(termClean);
        const matchDef = item.definitionEn.toLowerCase().includes(termClean);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(termClean));
        if (!matchTerm && !matchMeaning && !matchDef && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [vocabList, favorites, activeTab, selectedTrack, selectedLevel, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Từ điển F&B Chuyên ngành
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Hơn 100+ thuật ngữ và từ vựng chuẩn xác cho Nhà hàng, Khách sạn, Bar và Cafe.
        </p>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm từ vựng (ví dụ: reservation, bít tết, cocktail, sữa...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Tất cả ({vocabList.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'favorites'
                  ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Đã lưu ({favorites.length})</span>
            </button>
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedTrack}
              onChange={e => setSelectedTrack(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 focus:outline-none"
            >
              <option value="all">Mọi ngành</option>
              <option value="waiter">Phục vụ (Waiter)</option>
              <option value="bartender">Pha chế (Bartender)</option>
              <option value="barista">Cà phê (Barista)</option>
              <option value="kitchen">Bếp (Kitchen)</option>
              <option value="reception">Lễ tân (Reception)</option>
              <option value="general">Quản lý (General)</option>
            </select>

            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 focus:outline-none"
            >
              <option value="all">Mọi cấp độ</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
          <p className="text-xs text-neutral-500">Đang tải danh mục từ điển...</p>
        </div>
      ) : filteredWords.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200">
          <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
            Không tìm thấy từ vựng nào khớp với bộ lọc.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTrack('all');
              setSelectedLevel('all');
              setActiveTab('all');
            }}
            className="mt-3 text-xs font-bold text-primary-600 hover:underline"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map(word => {
            const isFav = favorites.includes(word.id);
            return (
              <div
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm culinary-card-hover cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-base font-black text-neutral-900 dark:text-neutral-100">
                          {word.term}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {word.ipa}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                        {word.partOfSpeech} • {word.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <AudioButton text={word.term} size="sm" showSlowToggle={true} />
                      <button
                        onClick={e => handleToggleFavorite(word.id, e)}
                        className={`p-1.5 rounded-full transition-all ${
                          isFav
                            ? 'text-red-500 bg-red-50 dark:bg-red-950/50'
                            : 'text-neutral-300 hover:text-red-400 hover:bg-neutral-100'
                        }`}
                        title={isFav ? 'Bỏ lưu' : 'Lưu từ yêu thích'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-primary-700 dark:text-primary-400 mt-2">
                    {word.meaningVi}
                  </p>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {word.definitionEn}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 text-[11px] space-y-1">
                    <p className="italic text-neutral-600 dark:text-neutral-300">
                      "{word.exampleEn}"
                    </p>
                    <p className="text-neutral-500 text-[10px]">
                      → {word.exampleVi}
                    </p>
                  </div>
                </div>

                {word.culturalNotes && (
                  <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-400">
                    <span className="line-clamp-1">💡 {word.culturalNotes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Word Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                    {selectedWord.term}
                  </h2>
                  <span className="text-xs font-mono text-neutral-400">
                    {selectedWord.ipa}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-100 dark:bg-primary-950 text-primary-700 uppercase">
                    {selectedWord.partOfSpeech}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600">
                    Level {selectedWord.level}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {selectedWord.track}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AudioButton text={selectedWord.term} size="md" showSlowToggle={true} />
                <button
                  onClick={() => setSelectedWord(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
                Nghĩa tiếng Việt:
              </h4>
              <p className="text-sm font-bold text-primary-700 dark:text-primary-400 mt-0.5">
                {selectedWord.meaningVi}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {selectedWord.definitionEn}
              </p>
            </div>

            {/* Example */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase text-neutral-400">
                Ví dụ giao tiếp tại quầy / bàn:
              </h4>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 italic">
                "{selectedWord.exampleEn}"
              </p>
              <p className="text-xs text-neutral-500">
                → {selectedWord.exampleVi}
              </p>
            </div>

            {/* Collocations */}
            {selectedWord.collocations && selectedWord.collocations.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase text-neutral-400 mb-1.5">
                  Cụm từ thường đi chung (Collocations):
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWord.collocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural Tip */}
            {selectedWord.culturalNotes && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold block mb-1">Mẹo văn hóa & Phục vụ:</span>
                <p className="leading-relaxed">{selectedWord.culturalNotes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setFeedbackWord(selectedWord);
                  setSelectedWord(null);
                }}
                className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Báo lỗi từ này</span>
              </button>

              <button
                onClick={() => setSelectedWord(null)}
                className="px-5 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackWord && (
        <FeedbackModal
          isOpen={Boolean(feedbackWord)}
          onClose={() => setFeedbackWord(null)}
          targetType="word"
          targetId={feedbackWord.id}
          targetTitle={feedbackWord.term}
        />
      )}
    </div>
  );
};

