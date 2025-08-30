import { useState, FormEvent, ChangeEvent } from 'react';
import { urlService } from '../utils/api';
import { isValidUrl } from '../utils/slugGenerator';
import { CreateUrlResponse } from '../types';

interface UrlFormProps {
  onUrlCreated: (newUrl: CreateUrlResponse) => void;
}

interface FormData {
  originalUrl: string;
  customSlug: string;
}

export default function UrlForm({ onUrlCreated }: UrlFormProps) {
  const [formData, setFormData] = useState<FormData>({
    originalUrl: '',
    customSlug: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.originalUrl) {
      setError('لطفا آدرس URL را وارد کنید');
      return;
    }

    if (!isValidUrl(formData.originalUrl)) {
      setError('آدرس URL معتبر نیست');
      return;
    }

    setLoading(true);

    try {
      const result = await urlService.createShortUrl(
        formData.originalUrl,
        formData.customSlug.trim()
      );
      
      setFormData({ originalUrl: '', customSlug: '' });
      onUrlCreated(result);
    } catch (error) {
      setError('خطا در ایجاد URL کوتاه. لطفا مجددا تلاش کنید.');
      console.error('Error creating short URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">ایجاد URL کوتاه</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">
            آدرس اصلی *
          </label>
          <input
            type="url"
            id="originalUrl"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug دلخواه (اختیاری)
          </label>
          <input
            type="text"
            id="customSlug"
            name="customSlug"
            value={formData.customSlug}
            onChange={handleChange}
            placeholder="my-custom-slug"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            در صورت خالی بودن، به صورت تصادفی تولید میشود
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'در حال ایجاد...' : 'ایجاد URL کوتاه'}
        </button>
      </form>
    </div>
  );
}