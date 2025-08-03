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

export interface LessonItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  course_id: string;
}

export interface LessonQuestion {
  id: string;
  lesson_id: string;
  question: string;
  answer: string;
  created_at: string;
}

// 新增的对话和评估相关接口
export interface DialogueMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

export interface Evaluation {
  accuracy: number;
  mainIdea: number;
  detailTracking: number;
  vocabulary: number;
  emotionalUnderstanding: number;
  overallFeedback: string;
}