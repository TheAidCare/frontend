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
import ConfirmationModal from '../ConfirmationModal';
import { useAppContext } from '@/context/AppContext';

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
  const { user } = useAppContext();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentInference, setCurrentInference] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentConsultationId, setCurrentConsultationId] = useState(propConsultationId);
  const [consultations, setConsultations] = useState([]);
  const [internalShowDefaultView, setInternalShowDefaultView] = useState(propShowDefaultView);
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [toastState, setToastState] = useState({
    isVisible: false,
    message: '',
    type: 'loading'
  });
  // New state to store pending send action
  const [pendingSend, setPendingSend] = useState(false);
  // New state to store the transcript when ready
  const transcriptRef = useRef("");

  // Use either the prop setter or internal state setter
  const setShowDefaultView = propSetShowDefaultView || setInternalShowDefaultView;
  const showDefaultView = propShowDefaultView ?? internalShowDefaultView;

  // Determine triage setting based on user role
  const isTriageEnabled = user?.role === 'chw';

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
          console.log(data)

          // Format and set messages from the consultation
          if (data.data?.consultation?.messages) {
            let lastInference = null;
            const formattedMessages = data.data.consultation.messages.map(msg => {
              if (msg.sender === 'user') {
                return {
                  timeSent: msg.createdAt,
                  content: msg.userMessage
                };
              } else if (msg.sender === 'system') {
                // Check the actual data structure to determine which inference to use
                if (msg.triageData && msg.triageData.triage_recommendation && msg.triageData.triage_recommendation.urgency_level) {
                  // This is a triage response
                  lastInference = msg.triageData;
                } else if (msg.clinicalData && msg.clinicalData.clinical_support_details && msg.clinicalData.clinical_support_details.potential_conditions) {
                  // This is a clinical response
                  lastInference = msg.clinicalData;
                } else {
                  // Fallback: check which data has more meaningful content
                  const triageHasContent = msg.triageData && (
                    msg.triageData.triage_recommendation?.urgency_level ||
                    msg.triageData.triage_recommendation?.summary_of_findings ||
                    msg.triageData.triage_recommendation?.recommended_actions_for_chw?.length > 0
                  );
                  
                  const clinicalHasContent = msg.clinicalData && (
                    msg.clinicalData.clinical_support_details?.potential_conditions?.length > 0 ||
                    msg.clinicalData.clinical_support_details?.suggested_investigations?.length > 0 ||
                    msg.clinicalData.clinical_support_details?.alerts_and_flags?.length > 0
                  );
                  
                  if (triageHasContent) {
                lastInference = msg.triageData;
                  } else if (clinicalHasContent) {
                    lastInference = msg.clinicalData;
                  }
                }
              }
            }).filter(Boolean);
            console.log(lastInference)
            setCurrentInference(lastInference);
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Error fetching consultation details:", error);
        }
      };
      fetchConsultationDetails();
    }

    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      reconnectionDelayMax: 10000,
      query: {
        "token": token,
        "patientId": patientId,
        ...(propConsultationId && { "consultationId": propConsultationId })
      }
    });

    socket.on("connect", () => {
      console.log("WebSocket connected for patient:", patientId, propConsultationId ? `and consultation: ${propConsultationId}` : '');
      setSocket(socket);
    });

    socket.on("consultationId", (data) => {
      console.log("Received consultation ID:", data);
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
      if (data.sender === 'system') {
        const testId = data.consultationId;
        // If we have a new consultation ID and we're not already on a consultation page,
        // navigate to the consultation page after receiving the system response
        if (testId && !propConsultationId) {
          setInputText('');
          setIsProcessing(false);
          router.push(`/app/patient/${patientId}/consultation/${testId}`);
        }
        console.log(data)
        
        // Use user role to determine which data to display
        if (isTriageEnabled) {
          // CHW user - show triage data
        setCurrentInference(data.triageData);
        } else {
          // Consultant/other users - show clinical data
          setCurrentInference(data.clinicalData);
        }
        
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

  // Called by AudioRecorder when transcription is ready
  const handleTranscription = (transcript) => {
    transcriptRef.current = transcript;
    actuallySendMessage(transcript, inputText);
  };

  // Send message through socket
  const actuallySendMessage = (transcript, manualContext) => {
    if (!socket) return;
        setIsProcessing(true);
          const messageData = {
      transcript_text: transcript,
      consultant_note: manualContext,
      triage: isTriageEnabled
          };
    if (!currentConsultationId) {
          socket.emit("startConsultation", messageData);
        } else {
          socket.emit("message", messageData);
        }
    setInputText("");
    // Do not set isProcessing to false here; wait for websocket response
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
            onTranscription={handleTranscription}
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
                    <div className="flex justify-between gap-3 items-center">
                      <p className={`text-sm ${styles.consultationMessage}`}>{consultation.firstMessage}</p>
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

        {/* Inference Section */}
        {!showDefaultView && currentInference && (
          <div className="max-w-md mx-auto px-4 mt-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
              {/* For Triage Responses - check if triage data exists */}
              {currentInference.triage_recommendation && (
                <>
                  {/* Urgency Level */}
                  {currentInference.triage_recommendation?.urgency_level && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                      <h4 className="font-medium text-red-700 mb-1">Urgency Level</h4>
                      <p className="text-red-600">{currentInference.triage_recommendation.urgency_level}</p>
                    </div>
                  )}

                  {/* Summary of Findings */}
                  {currentInference.triage_recommendation?.summary_of_findings && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <h4 className="font-medium text-green-700 mb-2">Summary of Findings</h4>
                      <p className="text-green-600">{currentInference.triage_recommendation.summary_of_findings}</p>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  {currentInference.triage_recommendation?.recommended_actions_for_chw?.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-700 mb-2">Recommended Actions</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {currentInference.triage_recommendation.recommended_actions_for_chw.map((action, idx) => (
                          <li key={idx} className="text-blue-600">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* For Clinical Responses - check if clinical data exists */}
              {currentInference.clinical_support_details && (
                <>
                  {/* Potential Conditions */}
                  {currentInference.clinical_support_details?.potential_conditions?.length > 0 && (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <h4 className="font-medium text-purple-700 mb-2">Potential Conditions</h4>
                      <div className="space-y-2">
                        {currentInference.clinical_support_details.potential_conditions.map((condition, idx) => (
                          <div key={idx} className="bg-purple-100 p-2 rounded">
                            <p className="text-purple-700 font-medium">{condition.name}</p>
                            <p className="text-purple-600 text-sm">{condition.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Investigations */}
                  {currentInference.clinical_support_details?.suggested_investigations?.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-700 mb-2">Suggested Investigations</h4>
                      <div className="space-y-2">
                        {currentInference.clinical_support_details.suggested_investigations.map((investigation, idx) => (
                          <div key={idx} className="bg-blue-100 p-2 rounded">
                            <p className="text-blue-700 font-medium">{investigation.test}</p>
                            <p className="text-blue-600 text-sm">{investigation.rationale}</p>
                </div>
              ))}
            </div>
          </div>
                  )}

                  {/* Alerts and Flags */}
                  {currentInference.clinical_support_details?.alerts_and_flags?.length > 0 && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                      <h4 className="font-medium text-red-700 mb-2">Alerts and Flags</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {currentInference.clinical_support_details.alerts_and_flags.map((alert, idx) => (
                          <li key={idx} className="text-red-600">{alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Differential Summary */}
                  {currentInference.clinical_support_details?.differential_summary_for_doctor && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <h4 className="font-medium text-green-700 mb-2">Differential Summary</h4>
                      <p className="text-green-600">{currentInference.clinical_support_details.differential_summary_for_doctor}</p>
            </div>
                  )}
                </>
              )}

              {/* Common sections for both response types */}
              {/* Extracted Symptoms */}
              {currentInference.extracted_symptoms?.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-700 mb-2">Extracted Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentInference.extracted_symptoms.map((symptom, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Retrieved Guidelines */}
              {currentInference.retrieved_guidelines_summary?.length > 0 && (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <h4 className="font-medium text-yellow-700 mb-2">Retrieved Guidelines</h4>
                  <div className="space-y-2">
                    {currentInference.retrieved_guidelines_summary.map((guideline, idx) => (
                      <div key={idx} className="bg-yellow-100 p-2 rounded">
                        <p className="text-yellow-700 font-medium">{guideline.source} - {guideline.code}</p>
                        <p className="text-yellow-600 text-sm">{guideline.case}</p>
                      </div>
                    ))}
                  </div>
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
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={onInputFocus}
            placeholder="Enter notes or symptoms manually."
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366F1] resize-none min-h-[48px] max-h-[120px]"
            rows={2}
          />
          {!showDefaultView && (
            <DocumentUploader
              onUpload={handleDocumentUpload}
              patientId={patientId}
              token={token}
            />
          )}
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