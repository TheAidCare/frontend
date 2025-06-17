import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
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
import DocumentUploader from '../DocumentUploader';

const ChatDashboard = ({ 
  children,
  showDefaultView: propShowDefaultView,
  setShowDefaultView: propSetShowDefaultView,
  sidebarProps = {},
  onAudioClick,
  onMediaClick,
  onInputFocus,
  token,
  patientId,
  patientData,
  currentConsultationId: propConsultationId,
}) => {
  const router = useRouter();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [currentInference, setCurrentInference] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentConsultationId, setCurrentConsultationId] = useState(propConsultationId);
  const [consultations, setConsultations] = useState([]);
  const [internalShowDefaultView, setInternalShowDefaultView] = useState(propShowDefaultView);
  const [isRecording, setIsRecording] = useState(false);
  const [toastState, setToastState] = useState({
    isVisible: false,
    message: '',
    type: 'loading'
  });

  // Use either the prop setter or internal state setter
  const setShowDefaultView = propSetShowDefaultView || setInternalShowDefaultView;
  const showDefaultView = propShowDefaultView ?? internalShowDefaultView;

  const handleAudioClick = (startRecording) => {
    if (startRecording) {
      setShowDefaultView(false);
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
    onAudioClick && onAudioClick(startRecording);
  };

  useEffect(() => {
    if (!token || !patientId) {
      return;
    }

    // Set up consultations from patient data
    if (patientData.consultations && patientData.consultations.length > 0) {
      const formattedConsultations = patientData.consultations.map(consultation => ({
        id: consultation._id,
        firstMessage: consultation.chats[0].userMessage || 'No messages',
        date: new Date(consultation.createdAt).toLocaleDateString(),
        time: new Date(consultation.createdAt).toLocaleTimeString()
      }));
      // console.log("Formatted consultations:", formattedConsultations);
      setConsultations(formattedConsultations);
      setShowDefaultView(false);
    } else {
      setShowDefaultView(true);
    }

    // If we have a consultation ID, fetch the consultation details
    if (propConsultationId) {
      const fetchConsultationDetails = async () => {
        try {
          const baseURL = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${baseURL}/api/v1/patients/${patientId}/consultation/${propConsultationId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error('Failed to fetch consultation details');
          const data = await res.json();

          // Format and set messages from the consultation
          if (data.data?.consultation?.messages) {
            const formattedMessages = data.data.consultation.messages.map(msg => {
              if (msg.sender === 'user') {
                return {
                  timeSent: msg.createdAt,
                  content: msg.userMessage
                };
              } else if (msg.sender === 'system') {
                // Set the latest system message as current inference
                setCurrentInference(msg.triageData);
              }
            }).filter(Boolean); // Remove any undefined messages
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Error fetching consultation details:", error);
        }
      };
      fetchConsultationDetails();
    }

    const socket = io("wss://aidcare-qrzkj.ondigitalocean.app", {
      reconnectionDelayMax: 10000,
      query: {
        "token": token,
        "patientId": patientId,
        ...(propConsultationId && { "consultationId": propConsultationId })
      }
    });

    socket.on("connect", () => {
      // console.log("WebSocket connected for patient:", patientId, propConsultationId ? `and consultation: ${propConsultationId}` : '');
      setSocket(socket);
    });

    socket.on("consultationId", (data) => {
      // console.log("Received consultation ID:", data);
      setCurrentConsultationId(data);
    });

    socket.on("message", (data) => {
      console.log("Message sent:", data);
      if (data.sender === 'user') {
        setMessages(prev => [...prev, { 
          timeSent: data.createdAt,
          content: data.userMessage
        }]);
      }
    });

    socket.on("response", (data) => {
      console.log("Received response:", data);
      if (data.sender === 'system' && data.triageData) {
        const testId = data.consultationId;
        // If we have a new consultation ID and we're not already on a consultation page,
        // navigate to the consultation page after receiving the system response
        if (testId && !propConsultationId) {
          setInputText('');
          setIsProcessing(false);
          router.push(`/app/patient/${patientId}/consultation/${testId}`);
        }

        setCurrentInference(data.triageData);
        setShowDefaultView(false);
        setIsProcessing(false);
      }
    });
    
    socket.on("disconnect", () => {
      console.log("WebSocket disconnected for patient:", patientId);
      setSocket(null);
    });

    // Store socket in state but don't clean up here
    setSocket(socket);

    // Only return a cleanup function that doesn't disconnect the socket
    return () => {
      // Remove event listeners but don't disconnect
      socket.off("connect");
      socket.off("consultationId");
      socket.off("message");
      socket.off("response");
      socket.off("disconnect");
    };
  }, [token, patientId, setShowDefaultView, propConsultationId, router]);

  // Handle consultation ID changes separately
  useEffect(() => {
    if (socket) {
      socket.on("consultationId", (data) => {
        setCurrentConsultationId(data);
      });
    }
  }, [socket]);

  // Separate useEffect for WebSocket cleanup on component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        console.log("Cleaning up WebSocket connection for patient:", patientId);
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket, patientId]);

  // useEffect(() => {
  //   if (currentConsultationId && currentConsultationId !== propConsultationId) {
  //     console.log("New consultation ID:", currentConsultationId);
  //     router.push(`/app/patient/${patientId}/consultation/${currentConsultationId}`);
  //     setInputText('');
  //     setIsProcessing(false);
  //   }
  // }, [currentConsultationId, patientId, router, propConsultationId, inputText, socket]);

  useEffect(() => {
    if (propConsultationId) {
      setCurrentConsultationId(propConsultationId);
    }
  }, [propConsultationId]);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() && socket) {
      try {
        setIsProcessing(true);
        if (!propConsultationId) {
          // If no consultation ID exists, start a new consultation
          const messageData = {
            transcript_text: inputText.trim(),
          };
          socket.emit("startConsultation", messageData);
          // Don't clear input or set processing to false here
          // Wait for the response event to handle that
        } else {
          // If we have a consultation ID, send the message directly
          const messageData = {
            transcript_text: inputText.trim(),
          };
          socket.emit("message", messageData);
          setInputText('');
          // Don't set processing to false here, wait for the response event
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setIsProcessing(false);
      }
    }
  };

  const handleConsultationClick = (consultationId) => {
    router.push(`/app/patient/${patientId}/consultation/${consultationId}`);
  };

  const handleDocumentUpload = (response) => {
    console.log('Document uploaded:', response);
    // Show success toast
    setToastState({
      isVisible: true,
      message: 'Document uploaded successfully',
      type: 'success'
    });
    // Exit default view after successful upload
    setShowDefaultView(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 right-4 z-50">
        <LoadingToast 
          isVisible={isProcessing || toastState.isVisible} 
          message={isProcessing ? 'Processing...' : toastState.message}
          type={isProcessing ? 'loading' : toastState.type}
        />
      </div>
      
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
        <Logo compact={!showDefaultView} />

        {patientData && (
          <PatientHeader patient={patientData} />
        )}

        {!showDefaultView && (
          <AudioRecorder 
            onToggle={handleAudioClick} 
            initialRecording={isRecording}
            socket={socket}
            currentConsultationId={currentConsultationId}
          />
        )}

        {/* Past Consultations Section */}
        {!showDefaultView && consultations.length > 0 && (
          <div className="max-w-md mx-auto px-4">
            <div 
              className={styles.collapsibleHeader}
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <span className="font-medium">Past Consultations</span>
              <IoChevronDown 
                className={`${styles.chevronIcon} ${isHistoryOpen ? styles.open : ''}`}
                size={20}
              />
            </div>
            <div className={`${styles.collapsibleContent} ${isHistoryOpen ? styles.open : ''}`}>
              <div className="px-4">
                {consultations.map((consultation) => (
                  <div 
                    key={consultation.id}
                    onClick={() => handleConsultationClick(consultation.id)}
                    className={`mb-2 p-3 rounded bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{consultation.firstMessage}</p>
                      <div className="text-xs text-gray-500">
                        <p>{consultation.date}</p>
                        <p>{consultation.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Consultation Messages
        {!showDefaultView && messages.length > 0 && (
          <div className="max-w-md mx-auto px-4 mt-4">
            <h3 className="font-medium mb-3">Current Consultation</h3>
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-[#6366F1] text-white ml-auto' 
                      : 'bg-gray-50 text-gray-700'
                  } max-w-[80%]`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.timeSent && (
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.timeSent).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Inference Section with Tabs */}
        {!showDefaultView && currentInference && (
          <div className="max-w-md mx-auto px-4 mt-4">
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
            <DefaultView 
              onAudioClick={handleAudioClick} 
              onMediaClick={onMediaClick}
              patientId={patientId}
            />
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
            <DocumentUploader
              onUpload={handleDocumentUpload}
              patientId={patientId}
              token={token}
            />
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

// DefaultView component
const DefaultView = ({ onAudioClick, onMediaClick, patientId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // If we're not on a patient screen, just trigger the new patient modal
    if (!patientId) {
      onMediaClick && onMediaClick();
      return;
    }

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image (JPEG, PNG, GIF) or PDF file');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENGINE_URL}/patients/${patientId}/upload_document/`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Document upload response:', data);
      
      // Call the onMediaClick callback with the response
      onMediaClick && onMediaClick(data);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document, Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    // If we're not on a patient screen, just trigger the new patient modal
    if (!patientId) {
      onMediaClick && onMediaClick();
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="w-9/10 max-w-md mx-auto space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".jpg,.jpeg,.png,.gif,.pdf"
        className="hidden"
      />
      <button 
        className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => {
          onAudioClick(true);
        }}
      >
        <h3 className="font-medium mb-1">Use audio</h3>
        <p className="text-sm text-gray-600">Let us listen and extract key points</p>
      </button>

      <button 
        className="w-full p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        <h3 className="font-medium mb-1">Upload media</h3>
        <p className="text-sm text-gray-600">
          {isUploading ? 'Uploading...' : 'Add files, images of lab results, etc'}
        </p>
      </button>
    </div>
  );
};

export default ChatDashboard; 