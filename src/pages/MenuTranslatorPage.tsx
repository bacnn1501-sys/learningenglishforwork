import React, { useState } from 'react';
import {
  Utensils,
  Search,
  Sparkles,
  Volume2,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { seedMenuTranslator, MenuTranslatorItem } from '../data/seedData';
import { AudioButton } from '../components/common/AudioButton';
import { removeVietnameseAccents } from '../utils/text';

export const MenuTranslatorPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuTranslatorItem>(seedMenuTranslator[0]);

  // Interactive Dish Builder Form
  const [cookingVerb, setCookingVerb] = useState('Pan-seared');
  const [protein, setProtein] = useState('Norwegian salmon fillet');
  const [sauceFlavor, setSauceFlavor] = useState('lemon herb butter reduction');
  const [sideDishes, setSideDishes] = useState('truffle mashed potatoes and grilled asparagus');
  const [allergenNote, setAllergenNote] = useState('Contains dairy (butter)');

  const generatedScript = `Our chef's recommendation is the ${cookingVerb.toLowerCase()} ${protein.toLowerCase()}, drizzled with a velvety ${sauceFlavor.toLowerCase()}, accompanied by ${sideDishes.toLowerCase()}. ${allergenNote ? `Please note this dish ${allergenNote.toLowerCase()}.` : ''}`;

  const filteredDishes = seedMenuTranslator.filter(item => {
    if (!search.trim()) return true;
    const clean = removeVietnameseAccents(search.toLowerCase());
    return (
      removeVietnameseAccents(item.vietnameseName.toLowerCase()).includes(clean) ||
      item.recommendedEnglishName.toLowerCase().includes(clean)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Menu Translator & Mô tả món ăn
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Dịch tên món Việt sang tên ẩm thực quốc tế kèm kịch bản giới thiệu nguyên liệu, hương vị và cảnh báo dị ứng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Dish List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm món (Phở, bún chả, cà phê muối...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-neutral-900 border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredDishes.map((item, idx) => {
              const isSelected = selectedItem.vietnameseName === item.vietnameseName;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/70 dark:bg-primary-950/40 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                    {item.vietnameseName}
                  </h3>
                  <p className="text-[11px] text-primary-600 font-semibold line-clamp-1 mt-0.5">
                    {item.recommendedEnglishName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center / Right: Detailed Script Viewer */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 uppercase">
                  {selectedItem.category}
                </span>
                <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                  {selectedItem.vietnameseName}
                </h2>
                <h3 className="text-sm font-bold text-primary-600">
                  {selectedItem.recommendedEnglishName}
                </h3>
              </div>
              <AudioButton text={selectedItem.staffDescriptionScript} size="md" showSlowToggle={true} />
            </div>

            {/* Script Box */}
            <div className="p-4 rounded-2xl bg-primary-50/70 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-900 space-y-1.5">
              <span className="text-[10px] font-bold text-primary-800 dark:text-primary-300 uppercase tracking-wider block">
                Mẫu câu phục vụ bàn mô tả cho khách nước ngoài:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-relaxed italic">
                "{selectedItem.staffDescriptionScript}"
              </p>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Cách chế biến:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedItem.cookingMethod}</p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Hương vị chính:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedItem.flavorProfile}</p>
              </div>
            </div>

            {/* Allergens warning */}
            {selectedItem.potentialAllergens && selectedItem.potentialAllergens.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  <span className="font-bold">Lưu ý chất gây dị ứng:</span> {selectedItem.potentialAllergens.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Dish Template Builder */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">
                Bộ công cụ tự ghép câu mô tả món (Template Builder)
              </h2>
            </div>
            <p className="text-xs text-neutral-500">
              Điền các thành phần món ăn của quán bạn để tạo ngay câu giới thiệu tiếng Anh tự nhiên:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Cách nấu (Verb):</label>
                <input
                  type="text"
                  value={cookingVerb}
                  onChange={e => setCookingVerb(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Nguyên liệu chính (Protein):</label>
                <input
                  type="text"
                  value={protein}
                  onChange={e => setProtein(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Nước sốt (Sauce / Flavor):</label>
                <input
                  type="text"
                  value={sauceFlavor}
                  onChange={e => setSauceFlavor(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Món ăn kèm (Sides):</label>
                <input
                  type="text"
                  value={sideDishes}
                  onChange={e => setSideDishes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold italic text-neutral-800 dark:text-neutral-200">
                "{generatedScript}"
              </p>
              <AudioButton text={generatedScript} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

