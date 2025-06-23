import { User } from '../types';

export const mockUser: User = {
  name: 'Alex',
  level: 'intermediate',
  streak: 7,
  lastPracticeDate: new Date().toISOString().split('T')[0],
  progress: {
    vocabulary: 65,
    grammar: 45,
    pronunciation: 30,
    conversation: 25,
  },
};