import { useEffect, useState } from 'react';
import { getSavedUser, clearUser } from '@/utils/auth';

export default function PatientSidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getSavedUser();
    if (u) setUser(u);
  }, []);

  return (
    <div className="p-4 flex flex-col h-full justify-between">
      <div>
        <button className="bg-blue-600 text-white px-3 py-2 rounded w-full mb-4">
          + New Patient
        </button>

        <input
          type="text"
          placeholder="Search patients..."
          className="w-full border px-2 py-1 mb-4 rounded"
        />

        <div className="space-y-2">
          <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
            Jane Doe
          </button>
          <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
            John Smith
          </button>
        </div>
      </div>

      {user && (
        <div className="mt-6 border-t pt-4 text-sm text-gray-600">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs capitalize">{user.role} - {user.orgId}</p>

          <button
            onClick={() => {
              clearUser();
              window.location.href = '/signup';
            }}
            className="mt-2 text-red-500 hover:underline text-xs"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}