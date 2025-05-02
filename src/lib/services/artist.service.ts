import { BaseService } from './base.service';
import { ApiResponse, Artist } from '@/types';
import { apiClient } from '../api-client';

export class ArtistService extends BaseService<Artist> {
  private static instance: ArtistService;

  private constructor() {
    super('/artists');
  }

  public static getInstance(): ArtistService {
    if (!ArtistService.instance) {
      ArtistService.instance = new ArtistService();
    }
    return ArtistService.instance;
  }

  async uploadProfileImage(id: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string, key: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    
    // Add artist ID to the form if provided
    if (id) {
      formData.append('artistId', id);
    }

    return apiClient.post('/admin/upload/artist', formData, {
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

  async getAreas(): Promise<ApiResponse<ApiResponse<{areas: string[]}>>> {
    return apiClient.get('/artists/areas');
  }

  async search(query: string): Promise<ApiResponse<Artist[]>> {
    return apiClient.get(`${this.baseUrl}`, { params: { search: query } });
  }

  async getPopular(): Promise<ApiResponse<Artist[]>> {
    return apiClient.get(`${this.baseUrl}`, { params: { sortBy: 'popularity', sortOrder: 'desc' } });
  }

  async updateSocialLinks(id: string, socialLinks: Artist['socialLinks']): Promise<ApiResponse<Artist>> {
    // For partial updates, we'll just use the full update endpoint
    const artist = await this.getById(id);
    if (artist.data) {
      return this.update(id, { ...artist.data, socialLinks });
    }
    throw new Error('Artist not found');
  }

  async updateLocation(id: string, location: Artist['location']): Promise<ApiResponse<Artist>> {
    // For partial updates, we'll just use the full update endpoint
    const artist = await this.getById(id);
    if (artist.data) {
      return this.update(id, { ...artist.data, location });
    }
    throw new Error('Artist not found');
  }
}

export const artistService = ArtistService.getInstance();