import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSavedUser } from '@/utils/auth';
import Loader from '@/components/Loader';

export default function SignupSuccessPage() {
  const router = useRouter();
  const { orgId } = router.query;
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getSavedUser();

    if (!user || user.role !== 'Admin') {
      router.replace('/signup');
      return;
    }

    if (orgId) {
      setInviteLink(`${window.location.origin}/login?orgId=${orgId}`);
    }

    setLoading(false);
  }, [orgId]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">
      <Loader />
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-4">Organization Created 🎉</h1>
        <p className="mb-4">
          Your organization has been set up! Share this invite link with your consultants or CHWs so they can join:
        </p>

        <div className="flex items-center border border-gray-300 rounded overflow-hidden mb-4">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="flex-1 px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              alert('Invite link copied!');
            }}
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 text-sm"
          >
            Copy
          </button>
        </div>

        <button
          onClick={() => router.push('/app')}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
