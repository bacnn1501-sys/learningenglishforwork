export type UserRole = 'learner' | 'admin';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  authProviders: string[];
  createdAt: number;
  lastLoginAt: number;
  onboardingDone: boolean;
  trackId: string;
  level: CEFRLevel;
  dailyGoalMinutes: number;
  xp: number;
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  settings: {
    darkMode: boolean;
    fontSize: 'sm' | 'md' | 'lg';
    dailyReminder: boolean;
    reminderTime?: string;
  };
}

export interface Track {
  id: string;
  nameEn: string;
  nameVi: string;
  descriptionEn: string;
  descriptionVi: string;
  icon: string;
  color: string;
  order: number;
  status: 'draft' | 'published';
}

export interface Unit {
  id: string;
  trackId: string;
  level: CEFRLevel;
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  order: number;
  status: 'draft' | 'published';
  icon: string;
  requiredScore: number; // e.g., 70
}

export type LessonType = 'vocabulary' | 'phrase' | 'dialogue' | 'exercise' | 'roleplay' | 'checkpoint';

export interface Lesson {
  id: string;
  unitId: string;
  trackId: string;
  titleEn: string;
  titleVi: string;
  type: LessonType;
  order: number;
  status: 'draft' | 'published';
  xpReward: number;
  contentSummary?: string;
  wordIds?: string[];
  dialogue?: Array<{
    speaker: 'guest' | 'staff' | 'narrator';
    textEn: string;
    textVi: string;
    tips?: string;
  }>;
}

export interface VocabularyItem {
  id: string;
  term: string;
  ipa: string;
  partOfSpeech: 'noun' | 'verb' | 'adj' | 'adv' | 'phrase' | 'idiom';
  meaningVi: string;
  definitionEn: string;
  exampleEn: string;
  exampleVi: string;
  collocations: string[];
  synonymsOrConfusedWith: string[];
  culturalNotes: string;
  tags: string[];
  level: CEFRLevel;
  track: string;
  imageUrl?: string;
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
  termLower: string;
  searchKeywords: string[];
}

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_in_the_blank'
  | 'matching'
  | 'reorder'
  | 'listening'
  | 'translation'
  | 'speaking'
  | 'roleplay'
  | 'scenario';

export interface ExerciseItem {
  id: string;
  lessonId: string;
  unitId: string;
  trackId: string;
  type: ExerciseType;
  promptEn: string;
  promptVi: string;
  audioText?: string;
  options?: string[];
  // For multiple_choice, listening, translation: string or string[]
  // For matching: record of left-to-right pairs
  // For reorder: string[] of correct sequence
  correctAnswer: any;
  explanationVi: string;
  explanationEn?: string;
  scenarioContext?: {
    guestMood?: 'friendly' | 'hurried' | 'angry' | 'curious';
    guestQuestionEn: string;
    guestQuestionVi: string;
    guestAudio?: string;
  };
  rolePlaySteps?: Array<{
    guestSaysEn: string;
    guestSaysVi: string;
    options: Array<{
      textEn: string;
      textVi: string;
      isBest: boolean;
      feedbackVi: string;
    }>;
  }>;
  status: 'draft' | 'published';
}

export interface PhraseCategory {
  id: string;
  situationVi: string;
  situationEn: string;
  category: string;
  icon?: string;
  phrases: Array<{
    en: string;
    vi: string;
    contextNote?: string;
    audioText?: string;
  }>;
  tags: string[];
  status: 'draft' | 'published';
}

export interface CultureNoteItem {
  id: string;
  titleVi: string;
  titleEn: string;
  targetCountryOrCulture: string;
  category: 'tipping' | 'dietary' | 'etiquette' | 'taboo' | 'communication';
  contentVi: string;
  contentEn: string;
  dos: string[];
  donts: string[];
  icon: string;
  status: 'draft' | 'published';
}

export interface UserLessonProgress {
  lessonId: string;
  unitId: string;
  completed: boolean;
  score: number;
  completedAt: number;
  attempts: number;
}

export interface UserSRSItem {
  wordId: string;
  easeFactor: number; // default 2.5
  interval: number;   // days
  repetitions: number;// streak
  nextReviewAt: number; // timestamp
  lastReviewedAt: number;
}

export interface UserMistakeItem {
  id: string;
  exerciseId: string;
  userAnswer: any;
  correctAnswer: any;
  promptEn: string;
  promptVi: string;
  explanationVi: string;
  resolved: boolean;
  createdAt: number;
}

export interface UserCustomWord {
  id: string;
  term: string;
  meaningVi: string;
  exampleEn?: string;
  notes?: string;
  createdAt: number;
}

export interface UserFeedback {
  id: string;
  userId: string;
  userEmail: string;
  targetType: 'word' | 'lesson' | 'general';
  targetId?: string;
  targetTitle?: string;
  message: string;
  createdAt: number;
  status: 'open' | 'resolved';
}

export interface GlobalStats {
  totalLearners: number;
  totalWords: number;
  totalLessons: number;
  totalCompletions: number;
  lastUpdated: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  streak: number;
  updatedAt: number;
}

export interface PlacementQuestion {
  id: string;
  questionEn: string;
  questionVi: string;
  options: string[];
  correctIndex: number;
  level: CEFRLevel;
  explanationVi: string;
}

