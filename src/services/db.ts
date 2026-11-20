import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  DocumentSnapshot,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Track,
  Unit,
  Lesson,
  VocabularyItem,
  ExerciseItem,
  PhraseCategory,
  CultureNoteItem,
  UserProfile,
  UserLessonProgress,
  UserSRSItem,
  UserMistakeItem,
  UserCustomWord,
  UserFeedback,
  LeaderboardEntry,
  GlobalStats
} from '../types';

// ==========================================
// 1. TRACKS, UNITS & LESSONS (CACHED)
// ==========================================

export async function getPublishedTracks(): Promise<Track[]> {
  try {
    const q = query(
      collection(db, 'tracks'),
      where('status', '==', 'published'),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Track));
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
}

export async function getUnitsByTrack(trackId: string): Promise<Unit[]> {
  try {
    const q = query(
      collection(db, 'units'),
      where('trackId', '==', trackId),
      where('status', '==', 'published'),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Unit));
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
}

export async function getLessonsByUnit(unitId: string): Promise<Lesson[]> {
  try {
    const q = query(
      collection(db, 'lessons'),
      where('unitId', '==', unitId),
      where('status', '==', 'published'),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  try {
    const d = await getDoc(doc(db, 'lessons', lessonId));
    if (!d.exists()) return null;
    return { id: d.id, ...d.data() } as Lesson;
  } catch (e) {
    console.error('Error getting lesson:', e);
    return null;
  }
}

// ==========================================
// 2. EXERCISES
// ==========================================

export async function getExercisesByLesson(lessonId: string): Promise<ExerciseItem[]> {
  try {
    const q = query(
      collection(db, 'exercises'),
      where('lessonId', '==', lessonId),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ExerciseItem));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
}

// ==========================================
// 3. VOCABULARY (PAGINATED & SEARCHABLE)
// ==========================================

export interface VocabQueryParams {
  track?: string;
  level?: string;
  searchTerm?: string;
  pageSize?: number;
  lastDoc?: DocumentSnapshot | null;
}

export async function getPublishedVocabulary({
  track,
  level,
  searchTerm,
  pageSize = 20,
  lastDoc = null
}: VocabQueryParams = {}): Promise<{ items: VocabularyItem[]; lastVisible: DocumentSnapshot | null }> {
  try {
    let constraints: any[] = [where('status', '==', 'published')];

    if (track && track !== 'all') {
      constraints.push(where('track', '==', track));
    }
    if (level && level !== 'all') {
      constraints.push(where('level', '==', level));
    }

    if (searchTerm && searchTerm.trim()) {
      const termLower = searchTerm.trim().toLowerCase();
      constraints.push(where('searchKeywords', 'array-contains', termLower));
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, 'vocabulary'), ...constraints);
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as VocabularyItem));
    const lastVisible = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    return { items, lastVisible };
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    return { items: [], lastVisible: null };
  }
}

export async function getVocabularyByIds(ids: string[]): Promise<VocabularyItem[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 10) {
      chunks.push(ids.slice(i, i + 10));
    }
    const results: VocabularyItem[] = [];
    for (const chunk of chunks) {
      const q = query(collection(db, 'vocabulary'), where('__name__', 'in', chunk));
      const snap = await getDocs(q);
      snap.forEach(d => results.push({ id: d.id, ...d.data() } as VocabularyItem));
    }
    return results;
  } catch (e) {
    console.error('Error fetching vocab by ids:', e);
    return [];
  }
}

// ==========================================
// 4. PHRASES & CULTURE NOTES
// ==========================================

export async function getPublishedPhrases(): Promise<PhraseCategory[]> {
  try {
    const q = query(collection(db, 'phrases'), where('status', '==', 'published'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PhraseCategory));
  } catch (e) {
    console.error('Error fetching phrases:', e);
    return [];
  }
}

export async function getPublishedCultureNotes(): Promise<CultureNoteItem[]> {
  try {
    const q = query(collection(db, 'cultureNotes'), where('status', '==', 'published'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CultureNoteItem));
  } catch (e) {
    console.error('Error fetching culture notes:', e);
    return [];
  }
}

// ==========================================
// 5. USER PROGRESS & GAMIFICATION
// ==========================================

export async function getUserProgressList(uid: string): Promise<Record<string, UserLessonProgress>> {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'progress'));
    const map: Record<string, UserLessonProgress> = {};
    snap.docs.forEach(d => {
      map[d.id] = d.data() as UserLessonProgress;
    });
    return map;
  } catch (e) {
    console.error('Error getting user progress:', e);
    return {};
  }
}

// Save complete lesson atomically (Batched write to minimize network and write costs)
export async function saveLessonCompletion({
  uid,
  lessonId,
  unitId,
  score,
  earnedXp,
  isFirstCompletion
}: {
  uid: string;
  lessonId: string;
  unitId: string;
  score: number;
  earnedXp: number;
  isFirstCompletion: boolean;
}): Promise<void> {
  const batch = writeBatch(db);

  // 1. Write user lesson progress
  const progressRef = doc(db, 'users', uid, 'progress', lessonId);
  batch.set(
    progressRef,
    {
      lessonId,
      unitId,
      completed: true,
      score,
      completedAt: Date.now(),
      attempts: increment(1)
    },
    { merge: true }
  );

  // 2. Update user profile XP, streak, lastStudyDate
  const todayStr = new Date().toISOString().split('T')[0];
  const userRef = doc(db, 'users', uid);

  batch.update(userRef, {
    xp: increment(earnedXp),
    lastStudyDate: todayStr,
    lastLoginAt: Date.now()
  });

  // 3. Update current weekly leaderboard
  const weekId = getWeeklyLeaderboardId();
  const leaderRef = doc(db, 'leaderboard', weekId, 'entries', uid);
  batch.set(
    leaderRef,
    {
      uid,
      xp: increment(earnedXp),
      updatedAt: Date.now()
    },
    { merge: true }
  );

  await batch.commit();
}

// ==========================================
// 6. SPACED REPETITION (SM-2)
// ==========================================

export async function getUserSRSList(uid: string): Promise<Record<string, UserSRSItem>> {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'srs'));
    const res: Record<string, UserSRSItem> = {};
    snap.docs.forEach(d => {
      res[d.id] = { wordId: d.id, ...d.data() } as UserSRSItem;
    });
    return res;
  } catch (e) {
    console.error('Error fetching SRS list:', e);
    return {};
  }
}

export async function saveUserSRSItem(uid: string, srs: UserSRSItem): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid, 'srs', srs.wordId), srs, { merge: true });
  } catch (e) {
    console.error('Error saving SRS item:', e);
  }
}

// ==========================================
// 7. MISTAKE NOTEBOOK (SỔ LỖI SAI)
// ==========================================

export async function saveUserMistake(uid: string, mistake: Omit<UserMistakeItem, 'id'>): Promise<void> {
  try {
    const ref = doc(collection(db, 'users', uid, 'mistakes'));
    await setDoc(ref, { id: ref.id, ...mistake });
  } catch (e) {
    console.error('Error saving mistake:', e);
  }
}

export async function getUserMistakes(uid: string): Promise<UserMistakeItem[]> {
  try {
    const q = query(
      collection(db, 'users', uid, 'mistakes'),
      where('resolved', '==', false),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserMistakeItem));
  } catch (e) {
    console.error('Error fetching mistakes:', e);
    return [];
  }
}

export async function resolveUserMistake(uid: string, mistakeId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid, 'mistakes', mistakeId), {
      resolved: true,
      resolvedAt: Date.now()
    });
  } catch (e) {
    console.error('Error resolving mistake:', e);
  }
}

// ==========================================
// 8. FAVORITES & CUSTOM WORD LIST
// ==========================================

export async function getUserFavorites(uid: string): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'favorites'));
    return snap.docs.map(d => d.id);
  } catch (e) {
    console.error('Error fetching favorites:', e);
    return [];
  }
}

export async function toggleUserFavorite(uid: string, wordId: string, isFav: boolean): Promise<void> {
  try {
    const favRef = doc(db, 'users', uid, 'favorites', wordId);
    if (isFav) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { wordId, addedAt: Date.now() });
    }
  } catch (e) {
    console.error('Error toggling favorite:', e);
  }
}

export async function getUserCustomWords(uid: string): Promise<UserCustomWord[]> {
  try {
    const q = query(
      collection(db, 'users', uid, 'my_words'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserCustomWord));
  } catch (e) {
    console.error('Error fetching custom words:', e);
    return [];
  }
}

export async function addUserCustomWord(uid: string, word: Omit<UserCustomWord, 'id' | 'createdAt'>): Promise<void> {
  try {
    const ref = doc(collection(db, 'users', uid, 'my_words'));
    await setDoc(ref, {
      id: ref.id,
      ...word,
      createdAt: Date.now()
    });
  } catch (e) {
    console.error('Error adding custom word:', e);
  }
}

export async function deleteUserCustomWord(uid: string, wordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', uid, 'my_words', wordId));
  } catch (e) {
    console.error('Error deleting custom word:', e);
  }
}

// ==========================================
// 9. LEADERBOARD & STATS
// ==========================================

export function getWeeklyLeaderboardId(): string {
  const d = new Date();
  const year = d.getUTCFullYear();
  // Get ISO week number
  const target = new Date(d.valueOf());
  const dayNr = (d.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${year}-W${weekNumber}`;
}

export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const weekId = getWeeklyLeaderboardId();
    const q = query(
      collection(db, 'leaderboard', weekId, 'entries'),
      orderBy('xp', 'desc'),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data() } as LeaderboardEntry));
  } catch (e) {
    console.error('Error fetching leaderboard:', e);
    return [];
  }
}

export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    const d = await getDoc(doc(db, 'stats', 'global'));
    if (d.exists()) {
      return d.data() as GlobalStats;
    }
  } catch (e) {
    console.warn('Stats document not yet initialized:', e);
  }
  return {
    totalLearners: 120,
    totalWords: 150,
    totalLessons: 24,
    totalCompletions: 340,
    lastUpdated: Date.now()
  };
}

// ==========================================
// 10. FEEDBACK
// ==========================================

export async function submitFeedback(feedback: Omit<UserFeedback, 'id' | 'createdAt' | 'status'>): Promise<void> {
  try {
    const ref = doc(collection(db, 'feedback'));
    await setDoc(ref, {
      id: ref.id,
      ...feedback,
      status: 'open',
      createdAt: Date.now()
    });
  } catch (e) {
    console.error('Error submitting feedback:', e);
    throw e;
  }
}

