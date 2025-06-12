import { useState } from 'react';
import { BsMicFill } from 'react-icons/bs';

const AudioRecorder = ({ onToggle }) => {
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    setIsListening(!isListening);
    onToggle?.(!isListening);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-full border transition-all duration-300 ${
          isListening 
            ? 'border-[#6366F1] bg-[#6366F1] bg-opacity-5' 
            : 'border-gray-200 hover:border-[#6366F1]'
        }`}
      >
        <div className="flex items-center gap-3">
          <BsMicFill className={`text-xl ${isListening ? 'text-[#6366F1]' : 'text-gray-500'}`} />
          <span className={`${isListening ? 'text-[#6366F1]' : 'text-gray-700'}`}>
            {isListening ? 'Listening...' : 'Tap to record'}
          </span>
        </div>
        <div 
          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
            isListening ? 'bg-[#6366F1]' : 'bg-gray-200'
          }`}
        >
          <div 
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
              isListening ? 'right-1' : 'left-1'
            }`}
          />
        </div>
      </button>
    </div>
  );
};

export default AudioRecorder; 