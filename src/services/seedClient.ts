import { writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import {
  seedTracks,
  seedUnits,
  seedLessons,
  seedVocabulary,
  seedExercises,
  seedPhrases,
  seedCultureNotes
} from '../data/seedData';

/**
 * Client-side seeder that writes complete dataset in batched chunks (max 400 docs/batch)
 * Can be run from Admin panel with 1-click.
 */
export async function seedAllDataToFirestore(
  onProgress?: (msg: string, percent: number) => void
): Promise<{ success: boolean; message: string }> {
  try {
    onProgress?.('Bắt đầu khởi tạo dữ liệu...', 5);

    // 1. Seed Tracks (6 docs)
    let batch = writeBatch(db);
    seedTracks.forEach(t => {
      batch.set(doc(db, 'tracks', t.id), t, { merge: true });
    });
    await batch.commit();
    onProgress?.('Đã nạp danh sách Tracks (Lộ trình)...', 15);

    // 2. Seed Units (9 docs)
    batch = writeBatch(db);
    seedUnits.forEach(u => {
      batch.set(doc(db, 'units', u.id), u, { merge: true });
    });
    await batch.commit();
    onProgress?.('Đã nạp danh sách Units (Chủ đề)...', 25);

    // 3. Seed Lessons (10 docs)
    batch = writeBatch(db);
    seedLessons.forEach(l => {
      batch.set(doc(db, 'lessons', l.id), l, { merge: true });
    });
    await batch.commit();
    onProgress?.('Đã nạp danh sách Bài học mẫu & Hội thoại...', 40);

    // 4. Seed Vocabulary (100+ docs in batches of 200)
    const vocabBatches: any[][] = [];
    for (let i = 0; i < seedVocabulary.length; i += 200) {
      vocabBatches.push(seedVocabulary.slice(i, i + 200));
    }
    for (let i = 0; i < vocabBatches.length; i++) {
      batch = writeBatch(db);
      vocabBatches[i].forEach(v => {
        batch.set(doc(db, 'vocabulary', v.id), v, { merge: true });
      });
      await batch.commit();
    }
    onProgress?.(`Đã nạp ${seedVocabulary.length} từ vựng chuẩn F&B...`, 65);

    // 5. Seed Exercises (30 docs)
    batch = writeBatch(db);
    seedExercises.forEach(ex => {
      batch.set(doc(db, 'exercises', ex.id), ex, { merge: true });
    });
    await batch.commit();
    onProgress?.('Đã nạp 30 bài tập tương tác & Speaking...', 80);

    // 6. Seed Phrases & Culture Notes
    batch = writeBatch(db);
    seedPhrases.forEach(p => {
      batch.set(doc(db, 'phrases', p.id), p, { merge: true });
    });
    seedCultureNotes.forEach(cn => {
      batch.set(doc(db, 'cultureNotes', cn.id), cn, { merge: true });
    });
    // Set global stats
    batch.set(doc(db, 'stats', 'global'), {
      totalLearners: 120,
      totalWords: seedVocabulary.length,
      totalLessons: seedLessons.length,
      totalCompletions: 340,
      lastUpdated: Date.now()
    }, { merge: true });
    await batch.commit();

    onProgress?.('Hoàn tất toàn bộ dữ liệu mẫu!', 100);
    return { success: true, message: `Đã nạp thành công ${seedVocabulary.length} từ vựng, ${seedExercises.length} bài tập, 6 Track và các hội thoại!` };
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return { success: false, message: error.message || 'Lỗi không xác định khi seed dữ liệu' };
  }
}

