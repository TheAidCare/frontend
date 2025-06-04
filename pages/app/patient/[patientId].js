// frontend/pages/app/patient/[patientId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext'; // Use context
import Sidebar from '@/components/Sidebar';
import styles from "@/styles/app.module.css"; //
import { RxHamburgerMenu } from 'react-icons/rx';
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

  useEffect(() => {
    if (routePatientId && token) { // Use token from context
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
    // Navigate to the newly created patient's page, or stay if already on a patient page
    if (newPatient && (newPatient._id || newPatient.id)) {
      router.push(`/app/patient/${newPatient._id || newPatient.id}`);
    }
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


  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`${styles.sidebarBtn} ${openSidebar ? styles.activeSidebarBtn : ''}`} //
      >
        <RxHamburgerMenu className={styles.sidebarIcon} />
      </button>
      <Sidebar 
        isOpen={openSidebar} 
        onClose={() => setOpenSidebar(false)}
      />
      <div className='flex flex-col justify-center items-center h-screen p-4'>
        <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
        {patientData ? (
          <div>
            <p><strong>ID:</strong> {patientData._id || patientData.id}</p>
            <p><strong>Name:</strong> {patientData.firstName} {patientData.lastName}</p>
            <p><strong>Date of Birth:</strong> {new Date(patientData.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {patientData.gender}</p>
          </div>
        ) : (
          // This part might be covered by the loading state or the !patientData && !loading check above
          <p>Loading patient data or data not available...</p>
        )}
        <button onClick={() => router.push('/app')} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Back to Dashboard
        </button>
      </div>
      {/* NewPatientModal is available globally via context, AppHome/this page controls its props */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen} // from context
        onClose={closeNewPatientModal} // from context
        onPatientCreated={handlePatientCreatedAndNavigate} // This uses onPatientAdded from context
      />
    </>
  );
}