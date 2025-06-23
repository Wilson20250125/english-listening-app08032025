export interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'conversation';
  description: string;
  duration: number; // in minutes
  completed?: boolean;
}

export interface Flashcard {
  id: string;
  word: string;
  definition: string;
  example: string;
  imageUrl?: string;
}

export interface User {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  streak: number;
  lastPracticeDate?: string;
  progress: {
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    conversation: number;
  };
}

export interface UserPerformance {
  id: string;
  user_id: string;
  category: string;
  score: number;
  completed_at: string;
  duration: number;
}