import { useState } from 'react';
import { useRouter } from 'next/router';
import { IoLockClosedOutline, IoMailOutline, IoPersonOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function SignupPage() {
  const router = useRouter();

  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    
    try {
      setError('');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organization/with-root-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          firstName: "Admin",
          lastName: orgName,
          email,
          password,
          passwordConfirm: password,
        }),
      });
    
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Signup failed');
      }
    
      const data = await res.json();
      const info = data.data
      localStorage.setItem('aidcare_user', JSON.stringify(info.user));
      localStorage.setItem('aidcare_token', info.token);
      router.push(`/signup/success?orgId=${info.user.organization}&orgName=${info.organization.name}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center">
      <div className="max-w-6xl mx-auto w-full px-4 py-12 md:py-20 grid md:grid-cols-2 items-center gap-12">
        {/* Left: brand + value prop */}
        <div className="hidden md:flex flex-col justify-center md:pr-8">
          <Logo />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Create your organization</h1>
          <p className="mt-2 text-gray-600">Set up your workspace and invite your team when you’re ready.</p>
          <ul className="mt-6 text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Organization‑level access</li>
            <li>Role‑aware guidance for CHWs and Consultants</li>
            <li>Secure patient management</li>
          </ul>
        </div>

        {/* Right: form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 w-full md:max-w-lg md:ml-auto">
          <h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-600 mt-1">Already have an account? <Link href="/login" className="text-[#6366F1] hover:underline">Log in</Link></p>

          {error && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => { e.preventDefault(); handleSignup(); }}
          >
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Organization name</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-[#6366F1]">
                <IoPersonOutline className="text-gray-500" />
                <input
                  id="orgName"
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Sunrise Health"
                  className="w-full outline-none placeholder:text-gray-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Organization email</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-[#6366F1]">
                <IoMailOutline className="text-gray-500" />
                <input
                  id="orgEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@org.com"
                  className="w-full outline-none placeholder:text-gray-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:border-[#6366F1]">
                <IoLockClosedOutline className="text-gray-500" />
                <input
                  id="orgPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#6366F1] text-white py-3 font-medium hover:bg-[#5457ea] transition"
            >
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}