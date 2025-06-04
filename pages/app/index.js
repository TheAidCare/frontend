// frontend/pages/app/index.js
import { useEffect, useState } from 'react'; // useState for local UI state like openSidebar
import { useRouter } from 'next/router';
import { useAppContext } from '@/context/AppContext'; // Use the context
import Sidebar from '@/components/Sidebar'; //
import NewPatientModal from '@/components/patients/NewPatientModal'; //
import styles from "@/styles/app.module.css"; //
import { RxHamburgerMenu } from 'react-icons/rx';
import Loader from '@/components/Loader'; //

export default function AppHome() {
  const router = useRouter();
  const { 
    user, 
    isNewPatientModalOpen, 
    openNewPatientModal, 
    closeNewPatientModal,
    onPatientAdded // Get the new handler from context
  } = useAppContext();
  
  const [openSidebar, setOpenSidebar] = useState(false);

  // User loading and redirection is now mostly handled by AppContext
  // But you might want a loading screen here until user is confirmed by context
  useEffect(() => {
    // If user is explicitly null after context has tried loading, redirect.
    // This check can be more robust depending on how context signals loading completion.
    // For now, if context has `user` as null and it's not a public page, it might imply not logged in.
    // AppContext's own useEffect handles initial redirection.
    // This is more of a safeguard if the page is accessed directly.
    if (user === null && !localStorage.getItem("aidcare_token")) { // A simple check
        // router.replace('/login'); // Or handled by AppContext already
    }
  }, [user, router]);


  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handlePatientCreatedAndNavigate = (newPatient) => {
    onPatientAdded(); // Call context's function to refresh list and close modal
    if (newPatient && (newPatient._id || newPatient.id)) {
      setOpenSidebar(false);
      router.push(`/app/patient/${newPatient._id || newPatient.id}`);
    }
  };

  if (!user) { // Show loader while user is being determined by context
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader /> {/* */}
      </div>
    );
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
        // onOpenNewPatientModal is now directly from context, Sidebar will use it
        // refreshPatientsTrigger is no longer needed
      />
      <div className='flex justify-center items-center h-screen'>
        Main Application Dashboard
      </div>
      {/* NewPatientModal consumes context for open/close actions indirectly via its props */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={closeNewPatientModal}
        onPatientCreated={handlePatientCreatedAndNavigate}
      />
    </>
  );
}