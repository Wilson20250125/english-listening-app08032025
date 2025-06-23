// src/types/UserPerformance.ts
export interface UserPerformance {
  id: number;
  user_id: string;
  category: string;
  completed_at: string;
  score: number;
  duration: number;
  task_type: string;
  task_title: string;
  task_description: string;
  evaluation_understanding: string;
  recommendations_for_improvement: string;
  created_at: string;
}
