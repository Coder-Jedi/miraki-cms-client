import { BaseService } from './base.service';
import { ApiResponse, Order, OrderStats } from '@/types';
import { apiClient } from '../api-client';

interface SalesByPeriod {
  period: string;
  count: number;
  total: number;
}

interface SalesByStatus {
  status: Order['status'];
  count: number;
  total: number;
}

export class OrderService extends BaseService<Order> {
  private static instance: OrderService;

  private constructor() {
    super('/orders');
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async updateStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    return apiClient.patch(`${this.baseUrl}/${id}/status`, { status }).then(res => res.data);
  }

  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<ApiResponse<Order>> {
    return apiClient.patch(`${this.baseUrl}/${id}/payment`, { paymentStatus }).then(res => res.data);
  }

  async updateTrackingInfo(id: string, trackingInfo: Order['trackingInfo']): Promise<ApiResponse<Order>> {
    return apiClient.patch(`${this.baseUrl}/${id}/tracking`, { trackingInfo }).then(res => res.data);
  }

  async getByUser(userId: string): Promise<ApiResponse<Order[]>> {
    return apiClient.get(`${this.baseUrl}/user/${userId}`);
  }

  async getStats(fromDate?: string, toDate?: string): Promise<OrderStats> {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    return apiClient.get<OrderStats>(`${this.baseUrl}/stats?${params.toString()}`).then(res => res.data);
  }

  async getSalesByPeriod(period: "daily" | "weekly" | "monthly" | "yearly"): Promise<SalesByPeriod[]> {
    return apiClient.get(`${this.baseUrl}/sales/${period}`).then(res => res.data);
  }

  async getSalesByStatus(): Promise<SalesByStatus[]> {
    return apiClient.get(`${this.baseUrl}/sales/by-status`).then(res => res.data);
  }

  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    return apiClient.get(`${this.baseUrl}/recent?limit=${limit}`).then(res => res.data);
  }
}

export const orderService = OrderService.getInstance();