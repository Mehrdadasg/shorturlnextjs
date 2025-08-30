// pages/[slug].tsx

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { urlService } from '../utils/api';

interface RedirectPageProps {
  error?: boolean;
}

const RedirectPage: NextPage<RedirectPageProps> = ({ error }) => {
  const router = useRouter();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            لینک پیدا نشد
          </h1>
          <p className="text-gray-600 mb-4">
            متاسفانه لینک مورد نظر یافت نشد یا منقضی شده است.
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          در حال انتقال...
        </h1>
        <p className="text-gray-600">
          لطفا کمی صبر کنید
        </p>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const userAgent = context.req.headers['user-agent'] || 'unknown';
  // گرفتن IP واقعی کاربر
  const forwarded = context.req.headers['x-forwarded-for'] as string;
  const ip = forwarded ? forwarded.split(',')[0] : context.req.socket.remoteAddress;

  

  try {
    // استفاده از urlService برای گرفتن URL اصلی
    const data = await urlService.getOriginalUrlWithLog(slug,userAgent,ip);

    console.log('RedirectPage called for slug:', slug, 'at', new Date().toISOString());

    if (data && data.originalUrl) {
      // ثبت کلیک
   

      return {
        redirect: {
          destination: data.originalUrl,
          permanent: false,
        },
      };
    }

    return { props: { error: true } };

  } catch (err) {
    //console.error('Redirect error:', err);
    return { props: { error: true } };
  }
};

export default RedirectPage;
