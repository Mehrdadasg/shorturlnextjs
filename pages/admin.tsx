import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Layout from '../components/Layout';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { urlService } from '../utils/api';
import { ShortUrl, CreateUrlResponse } from '../types';

const Admin: NextPage = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger]);

  const fetchUrls = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await urlService.getUrls();
      setUrls(data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      // در صورت خطا، از داده‌های تست استفاده می‌کنیم
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCreated = (newUrl: CreateUrlResponse): void => {
    const shortUrl: ShortUrl = {
      ...newUrl,
      updatedAt: new Date().toISOString()
    };
    setUrls(prevUrls => [shortUrl, ...prevUrls]);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout title="پنل ادمین - سرویس کوتاه کردن URL">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            پنل ادمین
          </h1>
          <p className="text-gray-600">
            مدیریت URL های کوتاه شده
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UrlForm onUrlCreated={handleUrlCreated} />
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">در حال بارگذاری...</p>
              </div>
            ) : (
              <UrlList urls={urls} refreshTrigger={refreshTrigger} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;