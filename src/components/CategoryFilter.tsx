import React from 'react';
import { BookOpen, BookText, Mic, MessageSquare } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onSelectCategory }) => {
  const categories = [
    { id: 'vocabulary', name: 'Vocabulary', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'grammar', name: 'Grammar', icon: <BookText className="h-5 w-5" /> },
    { id: 'pronunciation', name: 'Pronunciation', icon: <Mic className="h-5 w-5" /> },
    { id: 'conversation', name: 'Conversation', icon: <MessageSquare className="h-5 w-5" /> }
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeCategory === null 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;