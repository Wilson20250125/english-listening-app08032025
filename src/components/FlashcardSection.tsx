import React, { useState } from 'react';
import { Flashcard } from '../types';
import { ChevronLeft, ChevronRight, Repeat } from 'lucide-react';

interface FlashcardSectionProps {
  flashcards: Flashcard[];
}

const FlashcardSection: React.FC<FlashcardSectionProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };
  
  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };
  
  const currentCard = flashcards[currentIndex];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Vocabulary Practice</h2>
      
      <div 
        className="relative h-64 md:h-80 cursor-pointer mb-6"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`absolute w-full h-full rounded-lg shadow-md transition-all duration-500 ${
            isFlipped 
              ? 'transform-gpu rotate-y-180 opacity-0' 
              : 'transform-gpu rotate-y-0 opacity-100'
          }`}
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundImage: currentCard.imageUrl ? `url(${currentCard.imageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center' 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 rounded-lg"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-2">{currentCard.word}</h3>
            <p className="text-white text-opacity-80">Tap to reveal meaning</p>
          </div>
        </div>
        
        <div
          className={`absolute w-full h-full bg-blue-50 rounded-lg shadow-md p-6 flex flex-col justify-center transition-all duration-500 ${
            isFlipped 
              ? 'transform-gpu rotate-y-0 opacity-100' 
              : 'transform-gpu rotate-y-180 opacity-0'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h3 className="text-xl font-bold text-blue-800 mb-3">{currentCard.word}</h3>
          <p className="text-gray-800 mb-4">{currentCard.definition}</p>
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <p className="text-gray-600 italic">"{currentCard.example}"</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={handlePrevious}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        
        <div className="text-sm text-gray-600">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        
        <button 
          onClick={handleNext}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      
      <div className="mt-4 flex justify-center">
        <button className="flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          <Repeat className="h-4 w-4 mr-2" />
          Review All Cards
        </button>
      </div>
    </div>
  );
};

export default FlashcardSection;