import { apiClient } from '../api-client';
import { ApiResponse, PaginatedResponse } from '@/types';
import { AxiosError } from 'axios';

export class BaseService<T> {
  constructor(protected baseUrl: string) {}

  async getAll(params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<T>>> {
    return apiClient.get(this.baseUrl, { params });
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    return apiClient.get(`${this.baseUrl}/${id}`);
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return apiClient.post(this.baseUrl, data);
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return apiClient.put(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  protected handleError(error: AxiosError) {
    console.error('API Error:', error);
    throw error;
  }
}