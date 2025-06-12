import { useState, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoSend } from 'react-icons/io5';
import { IoChevronDown } from 'react-icons/io5';
import { IoAttach } from 'react-icons/io5';
import Sidebar from '@/components/Sidebar';
import appStyles from "@/styles/app.module.css";
import styles from "./ChatDashboard.module.css";
import Logo from '../Logo';
import { io } from "socket.io-client";
import AudioRecorder from '../AudioRecorder';
import PatientHeader from '../PatientHeader';
import LoadingToast from '../LoadingToast';

const ChatDashboard = ({ 
  children,
  showDefaultView,
  setShowDefaultView,
  sidebarProps = {},
  onAudioClick,
  onMediaClick,
  onInputFocus,
  token,
  patientId,
  patientData,
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions'); // or 'summary'
  const [currentInference, setCurrentInference] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (!token || !patientId) {
      return;
    }
    if (patientData.consultations.length < 1) {
      console.log("No consultations found");
      setShowDefaultView(true);
    } else {
      let pastMessages = patientData.consultations.map(consultation => {
        let lastChat = consultation.chats[consultation.chats.length - 1];
        return lastChat;
      })
      setMessages(pastMessages);
      setShowDefaultView(false);
    }

    const socket = io("wss://aidcare-qrzkj.ondigitalocean.app", {
      reconnectionDelayMax: 10000,
      query: {
        "token": token,
        "patientId": patientId
      }
    });

    socket.on("connect", () => {
      console.log("WebSocket connected for patient:", patientId);
      setSocket(socket);
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
      if (data.sender === 'system' && data.triageData) {
        setShowDefaultView(false);
        setCurrentInference(data.triageData);
        setIsProcessing(false); // Stop loading when system responds
      } else if (data.sender === 'user') {
        // Add user message to history
        setMessages(prev => [...prev, { 
          type: 'received', 
          content: data.content
        }]);
      }
    });

    // socket.on("recentMessages", (data) => {
    //   console.log("Received recent messages:", data);
    //   // Add the response to history if it contains content
    //   if (data.content) {
    //     setMessages(prev => [...prev, { type: 'received', content: data.content }]);
    //   }
    // });
    
    socket.on("disconnect", () => {
      console.log("WebSocket disconnected for patient:", patientId);
      setSocket(null);
    });

    return () => {
      if (socket) {
        console.log("Cleaning up WebSocket connection for patient:", patientId);
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [token, patientId, setShowDefaultView]);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleSendMessage = () => {
    if (inputText.trim() && socket) {
      const messageData = {
        message: inputText.trim()
      };
      
      // Start loading indicator
      setIsProcessing(true);
      
      // Send the message through socket
      socket.emit("message", messageData);
      setInputText('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LoadingToast isVisible={isProcessing} />
      
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

      <main className={styles.mainContent}>
        {/* Logo Section - Compact when on patient page */}
        <Logo compact={!showDefaultView} />

        {/* Patient Header */}
        {patientData && (
          <PatientHeader patient={patientData} />
        )}

        {/* Audio Recorder */}
        {!showDefaultView && (
          <AudioRecorder onToggle={onAudioClick} />
        )}

        {/* Collapsible Messages History */}
        {!showDefaultView && messages.length > 0 && (
          <div className="max-w-md mx-auto px-4">
            <div 
              className={styles.collapsibleHeader}
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <span className="font-medium">Context History</span>
              <IoChevronDown 
                className={`${styles.chevronIcon} ${isHistoryOpen ? styles.open : ''}`}
                size={20}
              />
            </div>
            <div className={`${styles.collapsibleContent} ${isHistoryOpen ? styles.open : ''}`}>
              <div className="px-4">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`mb-2 p-2 rounded bg-gray-50 text-gray-700`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inference Section with Tabs */}
        {!showDefaultView && currentInference && (
          <div className="max-w-md mx-auto px-4">
            {/* Tab Buttons */}
            <div className="flex rounded-full bg-gray-100 p-1 mb-4">
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'suggestions'
                    ? 'bg-white text-[#6366F1] shadow'
                    : 'text-gray-500'
                }`}
              >
                Suggestions
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'summary'
                    ? 'bg-white text-[#6366F1] shadow'
                    : 'text-gray-500'
                }`}
              >
                Summary
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              {activeTab === 'suggestions' ? (
                <div>
                  <h3 className="font-medium mb-3">Questions to Ask</h3>
                  {currentInference.triage_recommendation.recommended_actions_for_chw.map((action, idx) => (
                    <p key={idx} className="mb-2 text-gray-700">{action}</p>
                  ))}
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-3">Key Points</h3>
                  <p className="text-gray-700">{currentInference.triage_recommendation.summary_of_findings}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Default View or Children */}
        <div className="mt-8">
          {showDefaultView ? (
            <DefaultView onAudioClick={onAudioClick} onMediaClick={onMediaClick} />
          ) : (
            children
          )}
        </div>
      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={onInputFocus}
            placeholder="Enter notes or symptoms manually."
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366F1]"
          />
          {!showDefaultView && (
            <button
              onClick={onMediaClick}
              className="p-3 text-[#6366F1] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Upload files"
            >
              <IoAttach size={24} />
            </button>
          )}
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

// DefaultView component remains unchanged
const DefaultView = ({ onAudioClick, onMediaClick }) => (
  <div className="w-9/10 max-w-md mx-auto space-y-4">
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

export default ChatDashboard; 