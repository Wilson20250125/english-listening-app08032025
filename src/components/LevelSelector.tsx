import React from 'react';

interface LevelSelectorProps {
  activeLevel: string | null;
  onSelectLevel: (level: string | null) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ activeLevel, onSelectLevel }) => {
  const levels = [
    { id: 'beginner', name: 'Beginner', color: 'border-green-500' },
    { id: 'intermediate', name: 'Intermediate', color: 'border-blue-500' },
    { id: 'advanced', name: 'Advanced', color: 'border-purple-500' }
  ];
  
  return (
    <div className="flex flex-col items-center mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Level</h2>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onSelectLevel(null)}
          className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-colors ${
            activeLevel === null
              ? 'border-blue-600 bg-blue-50 text-blue-800'
              : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          All Levels
        </button>
        
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level.id)}
            className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-colors ${
              activeLevel === level.id
                ? `${level.color} bg-${level.color.split('-')[1]}-50 text-${level.color.split('-')[1]}-800`
                : `border-gray-300 text-gray-700 hover:${level.color} hover:bg-${level.color.split('-')[1]}-50`
            }`}
          >
            {level.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;