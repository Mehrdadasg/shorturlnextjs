// pages/admin.tsx
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

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const HARD_CODED_USER = 'admin';
  const HARD_CODED_PASS = '123456';

  useEffect(() => {
    const stored = localStorage.getItem('adminLoggedIn');
    if (stored === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchUrls();
  }, [refreshTrigger, isLoggedIn]);

  const fetchUrls = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await urlService.getUrls();
      setUrls(data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === HARD_CODED_USER && password === HARD_CODED_PASS) {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setLoginError('');
    } else {
      setLoginError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  if (!isLoggedIn) {
    return (
      <Layout title="ورود ادمین">
        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4 text-center">ورود ادمین</h2>
            {loginError && <p className="text-red-500 mb-2">{loginError}</p>}
            <input
              type="text"
              placeholder="نام کاربری"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
              ورود
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  // صفحه ادمین بعد از لاگین
  return (
    <Layout title="پنل ادمین - سرویس کوتاه کردن URL">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">پنل ادمین</h1>
            <p className="text-gray-600">مدیریت URL های کوتاه شده</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            خروج
          </button>
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
