import { BaseService } from './base.service';
import { ApiResponse, Collection } from '@/types';
import { apiClient } from '../api-client';

export class CollectionService extends BaseService<Collection> {
  private static instance: CollectionService;

  private constructor() {
    super('/collections');
  }

  public static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService();
    }
    return CollectionService.instance;
  }

  async uploadCoverImage(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    return apiClient.post(`${this.baseUrl}/upload`, formData, {
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

  async toggleFeatured(id: string, featured: boolean): Promise<ApiResponse<Collection>> {
    return apiClient.patch(`${this.baseUrl}/${id}/featured`, { featured });
  }

  async updatePriority(id: string, priority: number): Promise<ApiResponse<Collection>> {
    return apiClient.patch(`${this.baseUrl}/${id}/priority`, { priority });
  }

  async addArtwork(id: string, artworkId: string): Promise<ApiResponse<Collection>> {
    return apiClient.post(`${this.baseUrl}/${id}/artworks`, { artworkId });
  }

  async removeArtwork(id: string, artworkId: string): Promise<ApiResponse<Collection>> {
    return apiClient.delete(`${this.baseUrl}/${id}/artworks/${artworkId}`);
  }

  async reorderArtworks(id: string, artworkIds: string[]): Promise<ApiResponse<Collection>> {
    return apiClient.post(`${this.baseUrl}/${id}/artworks/reorder`, { artworkIds });
  }

  async getFeatured(): Promise<ApiResponse<Collection[]>> {
    return apiClient.get(`${this.baseUrl}/featured`);
  }
}

export const collectionService = CollectionService.getInstance();