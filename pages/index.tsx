import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // ریدایرکت به صفحه ادمین
    router.push('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">در حال انتقال...</p>
      </div>
    </div>
  );
};

export default Home;