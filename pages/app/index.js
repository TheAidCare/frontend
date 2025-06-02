import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSavedUser } from '@/utils/auth';
import Sidebar from '@/components/Sidebar';
import styles from "@/styles/app.module.css";
import { RxHamburgerMenu } from 'react-icons/rx';

export default function AppHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const storedUser = getSavedUser();
    if (!storedUser) {
      router.replace('/signup');
    } else {
      setUser(storedUser);
    }
  }, []);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`${styles.sidebarBtn} ${openSidebar ? styles.activeSidebarBtn : ''}`}
      >
        <RxHamburgerMenu className={styles.sidebarIcon} />
      </button>
      <Sidebar isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />
      <div className='flex justify-center items-center h-screen'>
        Main Application
      </div>
    </>
  );
}
