import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Database,
  Upload,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Sparkles,
  Loader2,
  BookOpen
} from 'lucide-react';
import {
  getDocs,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { getGlobalStats } from '../services/db';
import { seedAllDataToFirestore } from '../services/seedClient';
import { VocabularyItem, GlobalStats, UserFeedback } from '../types';
import { seedVocabulary } from '../data/seedData';
import { generateSearchKeywords } from '../utils/text';

export const AdminPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'vocab' | 'import' | 'feedback' | 'seed'>('stats');
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [vocabItems, setVocabItems] = useState<VocabularyItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Vocabulary Form Modal
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [editingWord, setEditingWord] = useState<Partial<VocabularyItem>>({
    term: '',
    ipa: '',
    partOfSpeech: 'noun',
    meaningVi: '',
    definitionEn: '',
    exampleEn: '',
    exampleVi: '',
    collocations: [],
    tags: ['general'],
    level: 'A1',
    track: 'waiter',
    culturalNotes: '',
    status: 'published'
  });

  // CSV/JSON Import State
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Seed State
  const [seedProgressMsg, setSeedProgressMsg] = useState<string>('');
  const [seedPercent, setSeedPercent] = useState<number>(0);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const s = await getGlobalStats();
        setStats(s);

        // Load feedback
        try {
          const fSnap = await getDocs(collection(db, 'feedback'));
          const fList = fSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserFeedback));
          setFeedbacks(fList);
        } catch (e) {
          console.warn('Feedback collection read:', e);
        }

        // Load some vocabulary
        try {
          const vSnap = await getDocs(collection(db, 'vocabulary'));
          if (!vSnap.empty) {
            setVocabItems(vSnap.docs.map(d => ({ id: d.id, ...d.data() } as VocabularyItem)));
          } else {
            setVocabItems(seedVocabulary);
          }
        } catch (e) {
          setVocabItems(seedVocabulary);
        }
      } catch (e) {
        console.error('Error loading admin portal:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  // Save / Update Word in Firestore
  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord.term || !editingWord.meaningVi) return;

    try {
      const wordId = editingWord.id || `v-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const termLower = editingWord.term.toLowerCase();
      const keywords = generateSearchKeywords(editingWord.term, [
        editingWord.meaningVi,
        editingWord.track || '',
        editingWord.level || '',
        ...(editingWord.tags || [])
      ]);

      const docData: VocabularyItem = {
        id: wordId,
        term: editingWord.term,
        ipa: editingWord.ipa || '',
        partOfSpeech: editingWord.partOfSpeech || 'noun',
        meaningVi: editingWord.meaningVi,
        definitionEn: editingWord.definitionEn || '',
        exampleEn: editingWord.exampleEn || '',
        exampleVi: editingWord.exampleVi || '',
        collocations: editingWord.collocations || [],
        synonymsOrConfusedWith: editingWord.synonymsOrConfusedWith || [],
        culturalNotes: editingWord.culturalNotes || '',
        tags: editingWord.tags || ['general'],
        level: editingWord.level || 'A1',
        track: editingWord.track || 'waiter',
        status: editingWord.status || 'published',
        createdAt: editingWord.createdAt || Date.now(),
        updatedAt: Date.now(),
        termLower,
        searchKeywords: keywords
      };

      await setDoc(doc(db, 'vocabulary', wordId), docData, { merge: true });

      setVocabItems(prev => {
        const idx = prev.findIndex(item => item.id === wordId);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = docData;
          return clone;
        }
        return [docData, ...prev];
      });

      setShowVocabModal(false);
      setEditingWord({
        term: '',
        ipa: '',
        partOfSpeech: 'noun',
        meaningVi: '',
        definitionEn: '',
        exampleEn: '',
        exampleVi: '',
        collocations: [],
        tags: ['general'],
        level: 'A1',
        track: 'waiter',
        culturalNotes: '',
        status: 'published'
      });
    } catch (err: any) {
      alert(`Lỗi khi lưu từ: ${err.message}`);
    }
  };

  // Delete word
  const handleDeleteWord = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa từ vựng này khỏi hệ thống?')) return;
    try {
      await deleteDoc(doc(db, 'vocabulary', id));
      setVocabItems(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      alert(`Lỗi khi xóa: ${err.message}`);
    }
  };

  // Resolve Feedback
  const handleResolveFeedback = async (id: string) => {
    try {
      await updateDoc(doc(db, 'feedback', id), { status: 'resolved' });
      setFeedbacks(prev =>
        prev.map(f => (f.id === id ? { ...f, status: 'resolved' } : f))
      );
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // Client-side CSV File Parser
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportErrors([]);
    setImportSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setImportErrors(['File CSV không có dữ liệu hoặc thiếu dòng tiêu đề.']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
      const parsedItems: any[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Simple CSV quote regex splitter
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        if (row.length < 4) {
          errors.push(`Dòng ${i + 1}: Thiếu các trường bắt buộc`);
          continue;
        }

        const cleanRow = row.map(cell => cell.replace(/^["']|["']$/g, '').trim());
        const term = cleanRow[0];
        const ipa = cleanRow[1] || '';
        const pos = cleanRow[2] || 'noun';
        const meaningVi = cleanRow[3];
        const defEn = cleanRow[4] || '';
        const exEn = cleanRow[5] || '';
        const exVi = cleanRow[6] || '';
        const collocations = (cleanRow[7] || '').split(';').map(c => c.trim()).filter(Boolean);
        const tags = (cleanRow[8] || '').split(';').map(t => t.trim()).filter(Boolean);
        const level = (cleanRow[9] || 'A1') as any;
        const track = cleanRow[10] || 'waiter';

        if (!term || !meaningVi) {
          errors.push(`Dòng ${i + 1}: Thiếu 'term' hoặc 'meaningVi'`);
          continue;
        }

        parsedItems.push({
          id: `v-${Date.now()}-${i}`,
          term,
          ipa,
          partOfSpeech: pos,
          meaningVi,
          definitionEn: defEn,
          exampleEn: exEn,
          exampleVi: exVi,
          collocations,
          synonymsOrConfusedWith: [],
          culturalNotes: '',
          tags: tags.length > 0 ? tags : ['imported'],
          level,
          track,
          status: 'published',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          termLower: term.toLowerCase(),
          searchKeywords: generateSearchKeywords(term, [meaningVi, track, level, ...tags])
        });
      }

      setImportPreview(parsedItems);
      setImportErrors(errors);
    };

    reader.readAsText(file);
  };

  // Commit Batched Import to Firestore (chunked into 400 per batch)
  const handleCommitImport = async () => {
    if (importPreview.length === 0) return;
    setIsImporting(true);
    try {
      const chunks: any[][] = [];
      for (let i = 0; i < importPreview.length; i += 300) {
        chunks.push(importPreview.slice(i, i + 300));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(item => {
          batch.set(doc(db, 'vocabulary', item.id), item, { merge: true });
        });
        await batch.commit();
      }

      setImportSuccessMsg(`Đã import thành công ${importPreview.length} từ vựng mới vào Firestore!`);
      setVocabItems(prev => [...importPreview, ...prev]);
      setImportPreview([]);
    } catch (err: any) {
      alert(`Lỗi import: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vocabItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fb_vocabulary_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Seed Handler
  const handleTriggerSeed = async () => {
    if (!confirm('Khởi tạo hoặc cập nhật lại toàn bộ 100+ từ vựng, bài tập mẫu và hội thoại vào Cloud Firestore?')) return;
    setIsSeeding(true);
    setSeedResult(null);

    const res = await seedAllDataToFirestore((msg, pct) => {
      setSeedProgressMsg(msg);
      setSeedPercent(pct);
    });

    setIsSeeding(false);
    setSeedResult(res);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Admin Portal</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-neutral-950 uppercase">
                Claim: admin: true
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Quản trị nội dung bài học, nhập từ vựng CSV/JSON và xử lý phản hồi người học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Sao lưu JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'stats'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Thống kê</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'vocab'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Từ vựng ({vocabItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'import'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Import CSV/JSON</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'feedback'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Báo lỗi ({feedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seed')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'seed'
              ? 'bg-amber-600 text-white'
              : 'text-amber-700 hover:text-amber-900 bg-amber-50 dark:bg-amber-950/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Seed Data (1-Click)</span>
        </button>
      </div>

      {/* ==========================================
          TAB 1: STATS (Aggregated Document)
      ========================================== */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-xs text-neutral-400 font-semibold">Tổng học viên</span>
            <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
              {stats?.totalLearners || 120}
            </div>
            <p className="text-[10px] text-emerald-600 mt-1">Lưu trong doc stats/global</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-xs text-neutral-400 font-semibold">Tổng số từ vựng</span>
            <div className="text-2xl font-black text-primary-600 mt-1">
              {vocabItems.length}
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">Không giới hạn số từ</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-xs text-neutral-400 font-semibold">Lượt hoàn thành bài</span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {stats?.totalCompletions || 340}
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">Tính năng batched writes</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-xs text-neutral-400 font-semibold">Phản hồi mở</span>
            <div className="text-2xl font-black text-red-600 mt-1">
              {feedbacks.filter(f => f.status === 'open').length}
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">Báo lỗi từ học viên</p>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: VOCABULARY CRUD
      ========================================== */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Quản lý danh mục từ điển F&B. Thêm mới, chỉnh sửa ví dụ, phiên âm và ghi chú văn hóa.
            </p>
            <button
              onClick={() => {
                setEditingWord({
                  term: '',
                  ipa: '',
                  partOfSpeech: 'noun',
                  meaningVi: '',
                  definitionEn: '',
                  exampleEn: '',
                  exampleVi: '',
                  collocations: [],
                  tags: ['waiter'],
                  level: 'A1',
                  track: 'waiter',
                  status: 'published'
                });
                setShowVocabModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm từ mới</span>
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 uppercase font-bold">
                  <tr>
                    <th className="px-4 py-3">Thuật ngữ</th>
                    <th className="px-4 py-3">IPA</th>
                    <th className="px-4 py-3">Nghĩa tiếng Việt</th>
                    <th className="px-4 py-3">Ngành</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {vocabItems.slice(0, 50).map(item => (
                    <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-neutral-900 dark:text-neutral-100">
                        {item.term}
                      </td>
                      <td className="px-4 py-3 font-mono text-neutral-400">
                        {item.ipa}
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary-600">
                        {item.meaningVi}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {item.track}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold">
                          {item.level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingWord(item);
                              setShowVocabModal(true);
                            }}
                            className="p-1.5 text-neutral-500 hover:text-primary-600 rounded-lg hover:bg-neutral-100"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteWord(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: BULK IMPORT (CSV/JSON)
      ========================================== */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">
                  Import hàng loạt Từ vựng (CSV / JSON)
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Parse dữ liệu an toàn tại client, validate trường và ghi theo lô (batched writes tối đa 300 doc/batch) nhằm tiết kiệm quota.
                </p>
              </div>

              <a
                href="/sample-vocab-import.csv"
                download="sample-vocab-import.csv"
                className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-bold text-neutral-700 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Tải CSV mẫu</span>
              </a>
            </div>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 text-center hover:border-primary-500 transition-colors">
              <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                Kéo thả file CSV vào đây hoặc bấm để chọn file
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="mt-3 text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            {importSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {importErrors.length > 0 && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Phát hiện {importErrors.length} lỗi khi kiểm tra file:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  {importErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview Section */}
            {importPreview.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Xem trước ({importPreview.length} từ hợp lệ sẵn sàng ghi):
                  </span>
                  <button
                    onClick={handleCommitImport}
                    disabled={isImporting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Xác nhận ghi vào Firestore</span>
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto border rounded-xl divide-y text-xs">
                  {importPreview.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold">{item.term}</span>{' '}
                        <span className="text-neutral-400 font-mono">({item.ipa})</span>: {item.meaningVi}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 rounded font-semibold">
                        {item.track} • {item.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: USER FEEDBACK
      ========================================== */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            Danh sách báo lỗi chính tả, dịch thuật hoặc đề xuất từ thực khách và người học.
          </p>

          {feedbacks.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold">Không có phản hồi nào cần xử lý.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map(f => (
                <div
                  key={f.id}
                  className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-100 text-primary-700 uppercase">
                        {f.targetType}
                      </span>
                      {f.targetTitle && (
                        <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                          Mục: {f.targetTitle}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {f.status === 'resolved' ? 'Đã xử lý' : 'Đang mở'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1">
                      "{f.message}"
                    </p>

                    <p className="text-[10px] text-neutral-400">
                      Gửi bởi: {f.userEmail} • {new Date(f.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  {f.status === 'open' && (
                    <button
                      onClick={() => handleResolveFeedback(f.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs whitespace-nowrap"
                    >
                      Đánh dấu đã sửa
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 5: 1-CLICK SEED DATA
      ========================================== */}
      {activeTab === 'seed' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100">
            Khởi tạo Dữ liệu mẫu (1-Click Seed)
          </h2>

          <p className="text-xs text-neutral-500 leading-relaxed">
            Nạp đầy đủ 6 Tracks, 9 Units, 24 Bài học & Hội thoại mẫu, 100+ Từ vựng chuẩn F&B, 30 Bài tập tương tác, 40 Mẫu câu giao tiếp và Ghi chú văn hóa vào Firestore qua cơ chế Batched Writes.
          </p>

          {isSeeding && (
            <div className="space-y-2 py-2">
              <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${seedPercent}%` }}
                />
              </div>
              <p className="text-xs font-bold text-amber-700 animate-pulse">
                {seedProgressMsg} ({seedPercent}%)
              </p>
            </div>
          )}

          {seedResult && (
            <div className={`p-4 rounded-2xl text-xs font-bold ${seedResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
              {seedResult.message}
            </div>
          )}

          <button
            onClick={handleTriggerSeed}
            disabled={isSeeding}
            className="px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-lg shadow-amber-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isSeeding ? 'Đang nạp dữ liệu...' : 'Bắt đầu khởi tạo dữ liệu'}</span>
          </button>
        </div>
      )}

      {/* Vocabulary Edit / Add Modal */}
      {showVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              {editingWord.id ? 'Chỉnh sửa Từ vựng' : 'Thêm Từ vựng mới'}
            </h3>

            <form onSubmit={handleSaveWord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Thuật ngữ (English) (*)</label>
                  <input
                    type="text"
                    required
                    value={editingWord.term || ''}
                    onChange={e => setEditingWord(prev => ({ ...prev, term: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Phiên âm IPA</label>
                  <input
                    type="text"
                    value={editingWord.ipa || ''}
                    onChange={e => setEditingWord(prev => ({ ...prev, ipa: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Nghĩa tiếng Việt (*)</label>
                <input
                  type="text"
                  required
                  value={editingWord.meaningVi || ''}
                  onChange={e => setEditingWord(prev => ({ ...prev, meaningVi: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Định nghĩa tiếng Anh đơn giản</label>
                <input
                  type="text"
                  value={editingWord.definitionEn || ''}
                  onChange={e => setEditingWord(prev => ({ ...prev, definitionEn: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Chuyên ngành</label>
                  <select
                    value={editingWord.track || 'waiter'}
                    onChange={e => setEditingWord(prev => ({ ...prev, track: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border"
                  >
                    <option value="waiter">Phục vụ (Waiter)</option>
                    <option value="bartender">Pha chế (Bartender)</option>
                    <option value="barista">Cà phê (Barista)</option>
                    <option value="kitchen">Bếp (Kitchen)</option>
                    <option value="reception">Lễ tân (Reception)</option>
                    <option value="general">Quản lý (General)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Level CEFR</label>
                  <select
                    value={editingWord.level || 'A1'}
                    onChange={e => setEditingWord(prev => ({ ...prev, level: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl border"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Câu ví dụ (English)</label>
                <input
                  type="text"
                  value={editingWord.exampleEn || ''}
                  onChange={e => setEditingWord(prev => ({ ...prev, exampleEn: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Dịch nghĩa câu ví dụ (Tiếng Việt)</label>
                <input
                  type="text"
                  value={editingWord.exampleVi || ''}
                  onChange={e => setEditingWord(prev => ({ ...prev, exampleVi: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Mẹo văn hóa & Phục vụ thực tế</label>
                <textarea
                  rows={2}
                  value={editingWord.culturalNotes || ''}
                  onChange={e => setEditingWord(prev => ({ ...prev, culturalNotes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVocabModal(false)}
                  className="px-4 py-2 rounded-xl border text-neutral-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-sm"
                >
                  Lưu vào Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

