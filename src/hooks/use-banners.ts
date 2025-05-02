import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerService } from "@/lib/services/banner.service";
import type { Banner } from "@/types";

interface BannerFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

const bannerKeys = {
  all: ["banners"] as const,
  lists: () => [...bannerKeys.all, "list"] as const,
  list: (filters: BannerFilters = {}) => [...bannerKeys.lists(), { filters }] as const,
  actives: () => [...bannerKeys.lists(), "active"] as const,
  details: () => [...bannerKeys.all, "detail"] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,
};

export function useBanners(params?: BannerFilters) {
  return useQuery({
    queryKey: bannerKeys.list(params),
    queryFn: () => bannerService.getAll(params),
  });
}

export function useActiveBanners() {
  return useQuery({
    queryKey: bannerKeys.actives(),
    queryFn: () => bannerService.getActiveBanners(),
  });
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => bannerService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Banner>) => bannerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Banner) => bannerService.update(data._id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(variables._id) });
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => bannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}

export function useUpdateBannerStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => 
      bannerService.updateStatus(id, active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(variables._id) });
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}

export function useUpdateBannerPriority() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: number }) => 
      bannerService.updatePriority(id, priority),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(variables._id) });
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}

export function useReorderBanners() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderedIds: string[]) => bannerService.reorder(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
}