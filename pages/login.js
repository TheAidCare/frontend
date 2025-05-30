import { useState } from 'react';
import { useRouter } from 'next/router';
import { saveUser } from '@/utils/auth';

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState('CHW'); // default
  const [loading, setLoading] = useState(false);

  const orgId = router.query.orgId;

  const handleLogin = () => {
    if (!name || !orgId) {
      alert('Name or org ID is missing.');
      return;
    }

    setLoading(true);

    saveUser({ name, orgId, role });
    router.push('/app');
  };

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