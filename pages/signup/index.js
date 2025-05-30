import { useState } from 'react';
import { useRouter } from 'next/router';
import { saveUser } from '@/utils/auth';

export default function SignupPage() {
  const router = useRouter();

  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (!orgName || !adminName || !email) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);

    const orgId = orgName.toLowerCase().replace(/\s+/g, '-');
    saveUser({ name: adminName, orgId, role: 'Admin' });

    router.push(`/signup/success?orgId=${orgId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-4">Sign Up Your Organization</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="e.g., Health Connect"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Admin Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="email@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Creating...' : 'Create Organization'}
          </button>
        </form>
      </div>
    </div>
  );
}