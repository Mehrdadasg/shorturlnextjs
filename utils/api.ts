import axios from 'axios';
import { ShortUrl, CreateUrlRequest, CreateUrlResponse, GetUrlResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4835';
const authorization='7e5b26cf3601ace410857e3a0e2a97ef'


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'authorization':authorization
  },
});

export const urlService = {
  // ایجاد URL کوتاه
  createShortUrl: async (originalUrl: string, customSlug: string = ''): Promise<CreateUrlResponse> => {
    try {
      const response = await api.post<CreateUrlResponse>('/api/v1.0/url/add', {
        originalUrl,
        customSlug: customSlug.trim()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت لیست URL ها
  getUrls: async (): Promise<ShortUrl[]> => {
    try {
      const response = await api.get<ShortUrl[]>('/api/v1.0/url/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // دریافت URL اصلی بر اساس slug
  getOriginalUrl: async (slug: string): Promise<GetUrlResponse> => {
    try {
      const response = await api.get<GetUrlResponse>(`/api/v1.0/url/getorigin?slug=${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

   // ایجاد URL کوتاه
   getOriginalUrlWithLog: async (slug: string, userAgent: string , clientIp: string ): Promise<GetUrlResponse> => {
    try {
      const response = await api.post<GetUrlResponse>('/api/v1.0/url/GetOriginWithLog', {
        slug,
        userAgent,
        clientIp
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
};