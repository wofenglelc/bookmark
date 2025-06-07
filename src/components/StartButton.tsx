import React from 'react';
import { Menu } from 'lucide-react';

interface StartButtonProps {
  onClick: () => void;
  isActive: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 left-4 p-3 rounded-lg shadow-lg transition-all duration-200 z-50 ${
        isActive 
          ? 'bg-blue-600 text-white scale-105' 
          : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
      } backdrop-blur-sm border border-gray-200`}
      title="Start Menu"
    >
      <Menu size={24} />
    </button>
  );
};

export default StartButton; 