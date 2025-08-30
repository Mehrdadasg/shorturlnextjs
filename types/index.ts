export interface ShortUrl {
    id: number;
    originalUrl: string;
    slug: string;
    clickCount: number;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface CreateUrlRequest {
    originalUrl: string;
    customSlug?: string;
  }
  
  export interface CreateUrlResponse {
    id: number;
    originalUrl: string;
    slug: string;
    shortUrl: string;
    clickCount: number;
    createdAt: string;
  }
  
  export interface GetUrlResponse {
    id: string;
    originalUrl: string;
    slug: string;
    clickCount: number;
    createdAt: string;
  }