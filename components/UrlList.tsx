import { useState, useEffect } from 'react';
import { ShortUrl } from '../types';

interface UrlListProps {
  urls: ShortUrl[];
  refreshTrigger: number;
}

export default function UrlList({ urls, refreshTrigger }: UrlListProps) {
  const [sortedUrls, setSortedUrls] = useState<ShortUrl[]>([]);

  useEffect(() => {
    const sorted = [...urls].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setSortedUrls(sorted);
  }, [urls, refreshTrigger]);

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      alert('آدرس کپی شد!');
    } catch (err) {
      console.error('خطا در کپی کردن:', err);
    }
  };

  const getDomain = (): string => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold">لیست URL ها</h2>
      </div>

      {sortedUrls.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          هنوز URL ای ایجاد نشده است
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آدرس اصلی
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آدرس کوتاه
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تعداد بازدید
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUrls.map((url) => {
                const shortUrl = `${getDomain()}/${url.slug}`;
                return (
                  <tr key={url.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          {shortUrl}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {url.clickCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => copyToClipboard(shortUrl)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        کپی
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}