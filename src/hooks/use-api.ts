import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types';

export function useApiQuery<T>(
  key: string[],
  fetchFn: () => Promise<ApiResponse<T>>,
  options = {}
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        const response = await fetchFn();
        return response.data;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An error occurred while fetching data",
        });
        throw error;
      }
    },
    ...options,
  });
}

export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    invalidateQueries?: string[];
  } = {}
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: V) => {
      try {
        const response = await mutationFn(variables);
        return response.data;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An error occurred",
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(query => {
          queryClient.invalidateQueries({ queryKey: [query] });
        });
      }
      options.onSuccess?.(data);
      toast({
        title: "Success",
        description: "Operation completed successfully",
      });
    },
    onError: (error: any) => {
      options.onError?.(error);
    },
  });
}