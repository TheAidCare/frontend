import { useState } from 'react';
import { useRouter } from 'next/router';
import { saveUser } from '@/utils/auth';
import styles from "@/styles/signup.module.css"
import { IoLockClosedOutline, IoMailOutline } from 'react-icons/io5';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // default
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
    
      const data = await res.json();
      console.log(data)
      const info = data.data
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
      <h1 className={styles.heading}>
        Log Into Your Account
      </h1>

      <form 
        className={styles.formLayout}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <section className={styles.formInputLayout}>
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
              placeholder="Enter Your Email" required
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
        </section>

        <button
          type="submit" disabled={loading}
          className={styles.formSubmitButton}
        >
          {loading ? "Creating..." : "Login"}
        </button>
      </form>

      <div className={styles.loginRedirectContainer}>
        <p>Don't have an account?</p>
        <Link href="/signup">Sign Up</Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Enter your details</h2>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="CHW">Community Health Worker</option>
        <option value="Consultant">Consultant</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Enter'}
      </button>
    </div>
  );
}