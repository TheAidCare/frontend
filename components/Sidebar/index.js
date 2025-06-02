import { IoSearch } from "react-icons/io5";
import styles from "./Sidebar.module.css";
import { useEffect, useState } from "react";
import { getSavedUser } from "@/utils/auth";
import { FaUserMd } from "react-icons/fa";

const Sidebar = ({isOpen, onClose}) => {

  const [patientQuery, setPatientQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = getSavedUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      console.error("No user found in local storage");
    }
  }, [])

  if (!isOpen) return null;

  const searchPatient = (e) => {
    e.preventDefault();
    console.log("Searching for patient:", patientQuery);
  }

  let roles = {
    consultant: "Clinical Consultant",
    chw: "Community Health Worker",
    organization: "Organization Admin",
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.sidebar} onClick={e => e.stopPropagation()}>
        <div className={styles.sidebarTop}>
          <form
            onSubmit={e => searchPatient(e)} className={styles.searchForm}
          >
            <button
              type="submit" aria-label="Click to search for inputted patient"
              className={styles.searchButton}
            >
              <IoSearch />
            </button>
            <input
              type="search" name="patientName" id="patientName" required
              value={patientQuery} onChange={(e) => setPatientQuery(e.target.value)}
              placeholder="Search" className={styles.searchInput}
            />
          </form>

          <button className={styles.createNewPatientBtn}>
            New Patient
          </button>
        </div>
        <div className={styles.sidebarMain}>

        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.userSection}>
            <div className={styles.userAvatar}>
              <FaUserMd />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>
                {user.firstName} {user.lastName}
              </p>
              <p className={styles.userRole}>
                {roles[user.role]}
              </p>
            </div>
          </div>

          <button className={styles.logOutBtn}>
            Log out
          </button>
        </div>
      </aside>
    </div>
  );
}
 
export default Sidebar;