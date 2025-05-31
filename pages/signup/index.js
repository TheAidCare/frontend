import { useState } from 'react';
import { useRouter } from 'next/router';
import { saveUser } from '@/utils/auth';
import { IoLockClosedOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import Link from 'next/link';
import styles from "@/styles/signup.module.css";

export default function SignupPage() {
  const router = useRouter();

  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (!orgName || !password || !email) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);

    const orgId = orgName.toLowerCase().replace(/\s+/g, '-');
    saveUser({ name: adminName, orgId, role: 'Admin' });

    router.push(`/signup/success?orgId=${orgId}`);
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Your Account</h1>

      <form 
        className={styles.formLayout}
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <section className={styles.formInputLayout}>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="orgName" aria-label='Organization Name'
              className={styles.formInputLabel}  
            >
              <IoPersonOutline />
            </label>
            <input
              type="text" name="orgName" id="orgName"
              value={orgName} onChange={(e) => setOrgName(e.target.value)}
              placeholder="Organization Name" required
              className={styles.formInputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="orgEmail" aria-label='Email'
              className={styles.formInputLabel}
            >
              <IoMailOutline />
            </label>
            <input
              type="email" name="orgEmail" id="orgEmail"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Organization Email" required
              className={styles.formInputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="orgPassword" aria-label='Password'
              className={styles.formInputLabel}
            >
              <IoLockClosedOutline />
            </label>
            <input
              type="password" name="orgPassword" id="orgPassword"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password" required
              className={styles.formInputField}
            />
          </div>
        </section>

        <button
          type="submit" disabled={loading}
          className={styles.formSubmitButton}
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <div className={styles.loginRedirectContainer}>
        <p>Already Have An Account?</p>
        <Link href="/login">Sign In</Link>
      </div>
    </div>
  );
}