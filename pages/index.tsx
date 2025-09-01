import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();



  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        
        <p className="mt-4 text-gray-600"></p>
      </div>
    </div>
  );
};

export default Home;