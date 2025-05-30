import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSavedUser } from '@/utils/auth';
import Loader from '@/components/Loader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getSavedUser();

    if (!user) {
      router.replace('/signup');
    } else if (user.role === 'Admin') {
      router.replace(`/signup/success?orgId=${user.orgId}`);
    } else {
      router.replace('/app');
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
}