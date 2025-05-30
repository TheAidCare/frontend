import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSavedUser } from '@/utils/auth';
import LayoutShell from '@/components/layout/LayoutShell';
import NewPatientPrompt from '@/components/patients/NewPatientPrompt';

export default function AppHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getSavedUser();
    if (!storedUser) {
      router.replace('/signup');
    } else {
      setUser(storedUser);
    }
  }, []);

  if (!user) return null;

  return (
    <LayoutShell>
      <NewPatientPrompt />
    </LayoutShell>
  );
}
