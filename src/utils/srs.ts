import { UserSRSItem } from '../types';

/**
 * SuperMemo SM-2 algorithm for Spaced Repetition (Flashcard Review)
 * Quality ratings:
 * 5: Perfect recall
 * 4: Correct recall after hesitation
 * 3: Correct recall with difficulty
 * 2: Incorrect recall, easy to remember once seen
 * 1: Incorrect recall, remembered upon viewing
 * 0: Complete blackout
 */
export function calculateSM2(
  currentSRS: Partial<UserSRSItem> | undefined,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): Omit<UserSRSItem, 'wordId'> {
  let repetitions = currentSRS?.repetitions || 0;
  let interval = currentSRS?.interval || 1;
  let easeFactor = currentSRS?.easeFactor || 2.5;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1; // 1 day
    } else if (repetitions === 1) {
      interval = 3; // 3 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response: reset to day 1
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const now = Date.now();
  const nextReviewAt = now + interval * 24 * 60 * 60 * 1000;

  return {
    repetitions,
    interval,
    easeFactor,
    nextReviewAt,
    lastReviewedAt: now
  };
}

