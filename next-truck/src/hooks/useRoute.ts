import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  RouteData,
  CreateRouteRequest,
  UpdateRouteRequest,
} from "@/types/api";

// Get all routes
export const useRoutes = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<RouteData[]>>(
        "/api/routes"
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get route by ID
export const useRoute = (routeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["route", routeId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<RouteData>>(
        `/api/routes/${routeId}`
      );
      return response.data.data;
    },
    enabled: !!routeId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Create route
export const useCreateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRouteRequest) => {
      const response = await axiosInstance.post<ApiResponse<RouteData>>(
        "/api/routes",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

// Update route
export const useUpdateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      routeId,
      data,
    }: {
      routeId: string;
      data: UpdateRouteRequest;
    }) => {
      const response = await axiosInstance.put<ApiResponse<RouteData>>(
        `/api/routes/${routeId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["route", variables.routeId] });
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

// Delete route
export const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeId: string) => {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/routes/${routeId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

// Toggle route active status
export const useToggleRouteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      routeId,
      isActive,
    }: {
      routeId: string;
      isActive: boolean;
    }) => {
      const response = await axiosInstance.patch<ApiResponse<RouteData>>(
        `/routes/${routeId}/status`,
        { isActive }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["route", variables.routeId] });
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};
