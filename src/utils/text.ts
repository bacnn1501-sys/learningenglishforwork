/**
 * Utility functions for text manipulation, Vietnamese normalization,
 * search keyword generation, and string similarity matching.
 */

// Strip Vietnamese diacritics for robust accent-insensitive search
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Generate search keywords for Firestore documents
export function generateSearchKeywords(text: string, extraKeywords: string[] = []): string[] {
  const clean = text.toLowerCase().trim();
  const noAccents = removeVietnameseAccents(text);
  const words = [...clean.split(/[\s,.-]+/), ...noAccents.split(/[\s,.-]+/)];
  const set = new Set<string>();

  words.forEach(w => {
    if (w.length >= 2) set.add(w);
  });
  extraKeywords.forEach(k => {
    const kClean = k.toLowerCase().trim();
    if (kClean) {
      set.add(kClean);
      set.add(removeVietnameseAccents(kClean));
    }
  });

  return Array.from(set);
}

// Calculate similarity ratio between two strings (0.0 to 1.0) for speech recognition scoring
export function calculateSimilarity(s1: string, s2: string): number {
  const norm1 = s1.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const norm2 = s2.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;

  // Word-level token match + Levenshtein distance
  const words1 = norm1.split(/\s+/);
  const words2 = norm2.split(/\s+/);

  let matchCount = 0;
  words1.forEach(w => {
    if (words2.includes(w)) matchCount++;
  });
  const tokenOverlap = (2 * matchCount) / (words1.length + words2.length);

  // Levenshtein character distance
  const track = Array(norm2.length + 1).fill(null).map(() =>
    Array(norm1.length + 1).fill(null)
  );

  for (let i = 0; i <= norm1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= norm2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= norm2.length; j += 1) {
    for (let i = 1; i <= norm1.length; i += 1) {
      const indicator = norm1[i - 1] === norm2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const levDistance = track[norm2.length][norm1.length];
  const maxLen = Math.max(norm1.length, norm2.length);
  const levRatio = 1 - levDistance / maxLen;

  // Combined score with higher weight on word accuracy
  return Math.min(1, Math.max(0, 0.4 * levRatio + 0.6 * tokenOverlap));
}

// Compare user translation or typed response against acceptable variants
export function isAnswerAcceptable(userInput: string, acceptableAnswers: string | string[]): boolean {
  const cleanUser = userInput.trim().toLowerCase().replace(/['".,!?;:]/g, '');
  const targets = Array.isArray(acceptableAnswers) ? acceptableAnswers : [acceptableAnswers];

  return targets.some(target => {
    const cleanTarget = target.trim().toLowerCase().replace(/['".,!?;:]/g, '');
    if (cleanUser === cleanTarget) return true;
    return calculateSimilarity(cleanUser, cleanTarget) >= 0.88;
  });
}

