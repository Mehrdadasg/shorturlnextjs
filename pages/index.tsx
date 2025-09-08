import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Head from "next/head";

const Home: NextPage = () => {
  const router = useRouter();



  return (
    <>
     <Head>
          <title>Short Url - لینک پیدا نشد</title>
          <meta name="description" content="لینک مورد نظر یافت نشد یا منقضی شده است" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            لینک پیدا نشد
          </h1>
          <p className="text-gray-600 mb-4">
            متاسفانه لینک مورد نظر یافت نشد یا منقضی شده است.
          </p>
         
        </div>
      </div>
    </>
  );
};

export default Home;