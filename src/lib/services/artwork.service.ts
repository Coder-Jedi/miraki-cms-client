import { BaseService } from './base.service';
import { ApiResponse, Artwork, PaginatedResponse } from '@/types';
import { apiClient } from '../api-client';

export class ArtworkService extends BaseService<Artwork> {
  private static instance: ArtworkService;

  private constructor() {
    super('/artworks');
  }

  public static getInstance(): ArtworkService {
    if (!ArtworkService.instance) {
      ArtworkService.instance = new ArtworkService();
    }
    return ArtworkService.instance;
  }

  async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string; key: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiClient.post(`/admin/upload/artwork`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  async toggleFeatured(id: string, featured: boolean): Promise<ApiResponse<Artwork>> {
    return apiClient.patch(`${this.baseUrl}/${id}/featured`, { featured });
  }

  async search(query: string): Promise<ApiResponse<Artwork[]>> {
    return apiClient.get(`${this.baseUrl}/search`, { params: { q: query } });
  }

  async getByCategory(category: string): Promise<ApiResponse<Artwork[]>> {
    return apiClient.get(`${this.baseUrl}/category/${category}`);
  }

  async getByArtist(artistId: string): Promise<ApiResponse<ApiResponse<PaginatedResponse<Artwork>>>> {
    return apiClient.get(`${this.baseUrl}/artist/${artistId}`);
  }
  
  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get(`${this.baseUrl}/categories`);
  }
  
  async getAreas(): Promise<ApiResponse<ApiResponse<{areas: string[]}>>> {
    return apiClient.get(`${this.baseUrl}/areas`);
  }
}

export const artworkService = ArtworkService.getInstance();