import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoSend } from 'react-icons/io5';
import Sidebar from '@/components/Sidebar';
import appStyles from "@/styles/app.module.css";
import styles from "./ChatDashboard.module.css";
import Logo from './Logo';

const ChatDashboard = ({ 
  children, // Main content area
  showDefaultView = true, // Whether to show default buttons or custom content
  onSendMessage, // Callback for when a message is sent
  sidebarProps = {}, // Props to pass to Sidebar component
  headerContent = null, // Optional header content to show below logo
  onAudioClick,
  onMediaClick,
  onInputFocus,
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [inputText, setInputText] = useState('');

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage?.(inputText.trim());
      setInputText('');
    }
  };

  const DefaultView = () => (
    <div className="w-9/10 max-w-md mx-auto space-y-4 transition-all duration-300 ease-in-out">
      <button 
        className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={onAudioClick}
      >
        <h3 className="font-medium mb-1">Use audio</h3>
        <p className="text-sm text-gray-600">Let us listen and extract key points</p>
      </button>

      <button 
        className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={onMediaClick}
      >
        <h3 className="font-medium mb-1">Upload media</h3>
        <p className="text-sm text-gray-600">Add files, images of lab results, etc</p>
      </button>
    </div>
  );

  return (
    <div className="">
      <button
        onClick={toggleSidebar}
        className={`${appStyles.sidebarBtn} ${openSidebar ? appStyles.activeSidebarBtn : ''} absolute top-4 left-4 z-50`}
      >
        <RxHamburgerMenu className={appStyles.sidebarIcon} />
      </button>

      <Sidebar 
        isOpen={openSidebar} 
        onClose={() => setOpenSidebar(false)}
        {...sidebarProps}
      />

      <main className="">
        {/* Logo Section */}
        <Logo />

        {/* Header Content (Patient Info) */}
        {headerContent && (
          <div className="w-95/100 max-w-md mb-8 mx-auto mt-1 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
            {headerContent}
          </div>
        )}

        {/* Main Content */}
        <div className={`w-full transition-all duration-300 ease-in-out transform ${showDefaultView ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          {showDefaultView && <DefaultView />}
        </div>
        
        <div className={`w-full transition-all duration-300 ease-in-out transform ${!showDefaultView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {!showDefaultView && children}
        </div>
      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={onInputFocus}
            placeholder="Enter notes or symptoms manually."
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366F1]"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 text-[#6366F1] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <IoSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard; 