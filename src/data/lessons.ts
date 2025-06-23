import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Common Greetings',
    level: 'beginner',
    category: 'vocabulary',
    description: 'Learn everyday greetings and introductions in English.',
    duration: 15,
  },
  {
    id: '2',
    title: 'Present Simple Tense',
    level: 'beginner',
    category: 'grammar',
    description: 'Master the present simple tense for daily conversations.',
    duration: 20,
  },
  {
    id: '3',
    title: 'Vowel Sounds',
    level: 'beginner',
    category: 'pronunciation',
    description: 'Practice the basic vowel sounds in English pronunciation.',
    duration: 15,
  },
  {
    id: '4',
    title: 'Making Requests',
    level: 'beginner',
    category: 'conversation',
    description: 'Learn polite ways to make requests in different situations.',
    duration: 25,
  },
  {
    id: '5',
    title: 'Idioms About Time',
    level: 'intermediate',
    category: 'vocabulary',
    description: 'Expand your vocabulary with common time-related idioms.',
    duration: 20,
  },
  {
    id: '6',
    title: 'Present Perfect vs Past Simple',
    level: 'intermediate',
    category: 'grammar',
    description: 'Understand the difference between these commonly confused tenses.',
    duration: 30,
  },
  {
    id: '7',
    title: 'Consonant Clusters',
    level: 'intermediate',
    category: 'pronunciation',
    description: 'Master difficult consonant combinations in English words.',
    duration: 20,
  },
  {
    id: '8',
    title: 'Job Interviews',
    level: 'intermediate',
    category: 'conversation',
    description: 'Practice common job interview questions and responses.',
    duration: 35,
  },
  {
    id: '9',
    title: 'Academic Vocabulary',
    level: 'advanced',
    category: 'vocabulary',
    description: 'Learn essential vocabulary for academic writing and speaking.',
    duration: 25,
  },
  {
    id: '10',
    title: 'Conditional Sentences',
    level: 'advanced',
    category: 'grammar',
    description: 'Master all types of conditional sentences for nuanced expression.',
    duration: 40,
  },
  {
    id: '11',
    title: 'Intonation Patterns',
    level: 'advanced',
    category: 'pronunciation',
    description: 'Perfect your intonation for natural-sounding English.',
    duration: 30,
  },
  {
    id: '12',
    title: 'Negotiation Skills',
    level: 'advanced',
    category: 'conversation',
    description: 'Learn sophisticated language for business negotiations.',
    duration: 45,
  },
];

export const getFilteredLessons = (level?: string, category?: string) => {
  return lessons.filter(lesson => 
    (!level || lesson.level === level) && 
    (!category || lesson.category === category)
  );
};