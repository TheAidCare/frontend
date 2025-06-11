// frontend/pages/app/patient/[patientId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext'; // Use context
import ChatDashboard from '@/components/ChatDashboard';
import styles from "@/styles/app.module.css"; //
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoSend } from 'react-icons/io5';
import Loader from '@/components/Loader'; //
import NewPatientModal from '@/components/patients/NewPatientModal'; //


export default function PatientDetailPage() {
  const router = useRouter();
  const { patientId: routePatientId } = router.query; // Renamed to avoid conflict
  const { 
    user, 
    token, 
    // Modal related state from context
    isNewPatientModalOpen,
    openNewPatientModal,
    closeNewPatientModal,
    onPatientAdded // Context function for when patient is created
  } = useAppContext();

  const [openSidebar, setOpenSidebar] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sessions, setSessions] = useState([]); // Will store patient's sessions

  useEffect(() => {
    if (routePatientId && token) {
      const fetchPatientDetails = async () => {
        setLoading(true);
        try {
          const baseURL = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${baseURL}/api/v1/patients/${routePatientId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Use token from context
            },
          });
          if (!res.ok) {
            throw new Error('Failed to fetch patient details');
          }
          const data = await res.json();
          setPatientData(data.data || data);
          
          // TODO: Fetch patient sessions here
          // For now, we'll just set an empty array
          setSessions([]);
        } catch (error) {
          console.error("Error fetching patient details:", error);
          setPatientData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPatientDetails();
    } else if (routePatientId && !token) {
        // Handle case where patientId is present but token isn't ready (e.g. show loader or error)
        setLoading(true); // Keep loading until token is available
    }
  }, [routePatientId, token]); // Depend on token from context

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // This function will be passed to NewPatientModal
  const handlePatientCreatedAndNavigate = (newPatient) => {
    onPatientAdded(); // Call context's function
    setOpenSidebar(false); // Close the sidebar
    // Navigate to the newly created patient's page, or stay if already on a patient page
    if (newPatient && (newPatient._id || newPatient.id)) {
      router.push(`/app/patient/${newPatient._id || newPatient.id}`);
    }
  };

  const handleSendMessage = (message) => {
    // Handle sending message here
    console.log('Message sent for patient:', routePatientId, message);
  };

  if (!user || loading ) { // Check for user from context
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" /> {/* */}
      </div>
    );
  }
  
  if (!patientData && !loading) {
    return (
         <div className="flex flex-col justify-center items-center h-screen p-4">
            <p>Patient not found or unable to load details.</p>
            <button onClick={() => router.push('/app')} className="mt-4 p-2 bg-blue-500 text-white rounded">
             Back to Dashboard
            </button>
         </div>
    )
  }

  // Patient info header component
  const PatientHeader = () => (
    <div className="bg-gray-50 rounded-xl p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-semibold text-gray-800">
          {patientData.firstName} {patientData.lastName}
        </span>
        <span className="px-3 py-1 bg-[#6366F1] text-white text-sm rounded-full">
          {patientData.gender}
        </span>
      </div>
    </div>
  );

  // Custom content for when there are sessions
  const SessionsView = () => (
    <div className="w-full max-w-3xl">
      {/* Session history will go here */}
      <p>Sessions view coming soon...</p>
    </div>
  );

  return (
    <div className="bg-white">
      <ChatDashboard
        showDefaultView={!sessions || sessions.length === 0}
        onSendMessage={handleSendMessage}
        headerContent={<PatientHeader />}
      >
        <SessionsView />
      </ChatDashboard>

      {/* Bottom Input Area */}
      {/* <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter notes or symptoms manually."
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366F1]"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            className="p-3 text-[#6366F1] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <IoSend size={24} />
          </button>
        </div>
      </div> */}

      {/* NewPatientModal is available globally via context, AppHome/this page controls its props */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen} // from context
        onClose={closeNewPatientModal} // from context
        onPatientCreated={handlePatientCreatedAndNavigate} // This uses onPatientAdded from context
      />
    </div>
  );
}