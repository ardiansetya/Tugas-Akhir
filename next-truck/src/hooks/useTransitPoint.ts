import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  TransitPointData,
} from "@/types/api";

// Get all transit points
export const useTransitPoints = () => {
  return useQuery({
    queryKey: ["transit-points", "all"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TransitPointData[]>>(
        "/api/transit-points"
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get transit point by ID
export const useTransitPoint = (transitPointId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["transit-points", "detail", transitPointId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TransitPointData>>(
        `/api/transit-points/${transitPointId}`
      );
      return response.data.data;
    },
    enabled: !!transitPointId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Create transit point
export const useCreateTransitPoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      loading_city_id: number;
      unloading_city_id: number;
      estimated_duration_minute: number;
      cargo_type: string;
      extra_cost: number;
      is_active: boolean;
    }) => {
      const response = await axiosInstance.post<ApiResponse<TransitPointData>>(
        "/api/transit-points",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transit-points"] });
    },
  });
};

// Update transit point
export const useUpdateTransitPoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transitPointId,
      data,
    }: {
      transitPointId: number;
      data: Partial<{
        loading_city_id: number;
        unloading_city_id: number;
        estimated_duration_minute: number;
        cargo_type: string;
        extra_cost: number;
        is_active: boolean;
      }>;
    }) => {
      const response = await axiosInstance.put<ApiResponse<TransitPointData>>(
        `/api/transit-points/${transitPointId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transit-points", "detail", variables.transitPointId],
      });
      queryClient.invalidateQueries({ queryKey: ["transit-points"] });
    },
  });
};

// Delete transit point
export const useDeleteTransitPoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transitPointId: number) => {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/transit-points/${transitPointId}`
      );
      return response.data;
    },
    onSuccess: (_, transitPointId) => {
      queryClient.removeQueries({
        queryKey: ["transit-points", "detail", transitPointId],
      });
      queryClient.invalidateQueries({ queryKey: ["transit-points"] });
    },
  });
};
