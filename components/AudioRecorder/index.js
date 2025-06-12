import { useState } from 'react';
import { BsMicFill } from 'react-icons/bs';

const AudioRecorder = ({ onToggle }) => {
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    setIsListening(!isListening);
    onToggle?.(!isListening);
  };

  return (
    <div className="w-9/10 max-w-md mx-auto mt-3 mb-6">
      <button
        onClick={handleToggle}
        className={`w-full cursor-pointer flex items-center justify-between px-4 py-3 rounded-full border transition-all duration-300 ${
          isListening 
            ? 'border-[#6366F1] bg-[#6366F1]' 
            : 'border-gray-200 hover:border-[#6366F1]'
        }`}
      >
        <div className="flex items-center gap-3">
          <BsMicFill className={`text-xl ${isListening ? 'text-[#f4f4f4]' : 'text-gray-500'}`} />
          <span className={`${isListening ? 'text-[#f4f4f4]' : 'text-gray-700'}`}>
            {isListening ? 'Listening...' : 'Tap to record'}
          </span>
        </div>
        <div 
          className={`w-12 h-6 rounded-full relative transition-all duration-300 bg-gray-200`}
        >
          <div 
            className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
              isListening ? 'right-1 bg-[#6366F1]' : 'left-1 bg-white'
            }`}
          />
        </div>
      </button>
    </div>
  );
};

export default AudioRecorder; 