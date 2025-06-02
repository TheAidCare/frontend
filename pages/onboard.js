import { useState } from 'react';
import { useRouter } from 'next/router';
import { IoLockClosedOutline, IoMailOutline, IoPersonOutline } from 'react-icons/io5';
import styles from "@/styles/signup.module.css"

const OnboardUser = () => {
  const router = useRouter();

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consultant'); // Default role is 'consultant'
  const [loading, setLoading] = useState(false);
  const orgId = router.query.orgId;

  const registerUser = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fName,
          lastName: lName,
          email,
          password,
          passwordConfirm: password,
          organization: orgId,
          role,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'User Registration failed');
      }

      const data = await res.json();
      const info = data.data;
      localStorage.setItem('aidcare_user', JSON.stringify(info.user));
      localStorage.setItem('aidcare_token', info.token);
      router.push(`/app`);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <h1>Register User</h1>
        <p>
          Access your workspace. Get AI support for better patient care.
        </p>
      </div>

      <form
        className={styles.formLayout}
        onSubmit={(e) => {
          e.preventDefault();
          registerUser();
        }}
      >
        <section className={styles.formInputLayout}>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="fName" aria-label='First Name'
              className={styles.formInputLabel}
            >
              <IoPersonOutline />
            </label>
            <input
              type="text" name="fName" id="fName"
              value={fName} onChange={(e) => setFName(e.target.value)}
              placeholder="First name" required
              className={styles.formInputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="lName" aria-label='Last Name'
              className={styles.formInputLabel}
            >
              <IoPersonOutline />
            </label>
            <input
              type="text" name="lName" id="lName"
              value={lName} onChange={(e) => setLName(e.target.value)}
              placeholder="Last name"
              className={styles.formInputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="email" aria-label='Email'
              className={styles.formInputLabel}
            >
              <IoMailOutline />
            </label>
            <input
              type="email" name="email" id="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" required
              className={styles.formInputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="password" aria-label='Password'
              className={styles.formInputLabel}
            >
              <IoLockClosedOutline />
            </label>
            <input
              type="password" name="password" id="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required
              className={styles.formInputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label
              htmlFor="role" aria-label='User Role'
              className={styles.formInputLabel}
            >
              <IoPersonOutline />
            </label>
            <select
              name="role" id="role" required
              value={role} onChange={(e) => setRole(e.target.value)}
              className={styles.formInputField}
            >
              <option value="consultant">Consultant</option>
              <option value="chw">Community Health Worker</option>
            </select>
          </div>
        </section>

        <button
          type="submit" disabled={loading}
          className={styles.formSubmitButton}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default OnboardUser;