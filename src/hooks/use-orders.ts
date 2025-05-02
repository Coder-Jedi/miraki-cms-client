import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/lib/services/order.service";
import type { Order, OrderStats, PaginatedResponse, ApiResponse } from "@/types";

interface OrderFilters extends Record<string, string | number | boolean | undefined> {
  page?: number;
  limit?: number;
  status?: Order["status"];
  paymentStatus?: Order["paymentStatus"];
  search?: string;
  fromDate?: string;
  toDate?: string;
}

const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: OrderFilters = {}) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: () => [...orderKeys.all, "stats"] as const,
  statsWithDate: (filters: Pick<OrderFilters, "fromDate" | "toDate">) => 
    [...orderKeys.stats(), { filters }] as const,
};

export function useOrders(params?: OrderFilters) {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      const response = await orderService.getAll(params);
      return response.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await orderService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useOrderStats(params?: Pick<OrderFilters, "fromDate" | "toDate">) {
  return useQuery<OrderStats>({
    queryKey: orderKeys.statsWithDate(params ?? {}),
    queryFn: () => orderService.getStats(params?.fromDate, params?.toDate),
  });
}

export function useSalesByPeriod(period: "daily" | "weekly" | "monthly" | "yearly") {
  return useQuery({
    queryKey: [...orderKeys.stats(), period],
    queryFn: () => orderService.getSalesByPeriod(period),
  });
}

export function useSalesByStatus() {
  return useQuery({
    queryKey: [...orderKeys.stats(), "by-status"],
    queryFn: () => orderService.getSalesByStatus(),
  });
}

export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: [...orderKeys.lists(), "recent", limit],
    queryFn: () => orderService.getRecentOrders(limit),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderPaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: Order["paymentStatus"] }) =>
      orderService.updatePaymentStatus(id, paymentStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables._id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useUpdateOrderTrackingInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, trackingInfo }: { id: string; trackingInfo: Order["trackingInfo"] }) =>
      orderService.updateTrackingInfo(id, trackingInfo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables._id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}