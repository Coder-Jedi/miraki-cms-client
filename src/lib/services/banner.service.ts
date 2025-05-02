import { BaseService } from './base.service';
import type { Banner, ApiResponse } from '@/types';
import { apiClient } from '../api-client';

export class BannerService extends BaseService<Banner> {
  private static instance: BannerService;

  private constructor() {
    super('/banners');
  }

  public static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService();
    }
    return BannerService.instance;
  }

  async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> {
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

  async updateStatus(id: string, active: boolean): Promise<ApiResponse<Banner>> {
    return apiClient.patch(`${this.baseUrl}/${id}/status`, { active });
  }

  async updatePriority(id: string, priority: number): Promise<ApiResponse<Banner>> {
    return apiClient.patch(`${this.baseUrl}/${id}/priority`, { priority });
  }

  async getActiveBanners(): Promise<ApiResponse<Banner[]>> {
    return apiClient.get(`${this.baseUrl}/active`);
  }

  async reorder(orderedIds: string[]): Promise<ApiResponse<Banner[]>> {
    return apiClient.post(`${this.baseUrl}/reorder`, { orderedIds });
  }
}

export const bannerService = BannerService.getInstance();