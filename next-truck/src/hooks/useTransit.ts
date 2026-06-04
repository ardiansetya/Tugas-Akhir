import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  TransitData,
  AcceptTransitRequest,
  RejectTransitRequest,
  DeliveryTransitData,
} from "@/types/api";

// Get all transits (simple version)
export const useTransits = () => {
  return useQuery({
    queryKey: ["transits"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TransitData[]>>(
        "/api/delivery/transit"
      );
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get all transits with full details (includes transit_point, delivery info, etc)
export const useTransitsWithDetails = () => {
  return useQuery({
    queryKey: ["transits", "details"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<DeliveryTransitData[]>>(
        "/api/delivery/transit/details"
      );
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get transit by ID
export const useTransit = (transitId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["transit", transitId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TransitData>>(
        `/api/delivery/transit/${transitId}`
      );
      return response.data.data;
    },
    enabled: !!transitId && enabled,
    staleTime: 1 * 60 * 1000,
  });
};

// Get transits by delivery ID
export const useTransitsByDelivery = (
  deliveryId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["transits", "delivery", deliveryId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TransitData[]>>(
        `/api/delivery/${deliveryId}/transit`
      );
      return response.data.data;
    },
    enabled: !!deliveryId && enabled,
    staleTime: 1 * 60 * 1000,
  });
};

// Accept transit
export const useAcceptTransit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transitId,
      data,
    }: {
      transitId: string;
      data?: AcceptTransitRequest;
    }) => {
      const response = await axiosInstance.post<ApiResponse<TransitData>>(
        `/api/delivery/transit/${transitId}/accept`,
        data || {}
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transit", variables.transitId] });
      queryClient.invalidateQueries({ queryKey: ["transits"] });
    },
  });
};

// Reject transit
export const useRejectTransit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transitId,
      data,
    }: {
      transitId: string;
      data: RejectTransitRequest;
    }) => {
      const response = await axiosInstance.post<ApiResponse<TransitData>>(
        `/api/delivery/transit/${transitId}/reject`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transit", variables.transitId] });
      queryClient.invalidateQueries({ queryKey: ["transits"] });
    },
  });
};

// Create transit (if needed)
export const useCreateTransit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      deliveryId: string;
      transitPointId: number;
      arrivedAt: number;
    }) => {
      const response = await axiosInstance.post<ApiResponse<TransitData>>(
        "/api/delivery/transit",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transits"] });
    },
  });
};

// Accept or Reject transit (using unified endpoint)
export const useAcceptOrRejectTransit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      deliveryTransitId: string;
      isAccepted: boolean;
      reason?: string;
    }) => {
      // Convert camelCase to snake_case for API request
      const requestBody = {
        delivery_transit_id: data.deliveryTransitId,
        is_accepted: data.isAccepted,
        ...(data.reason && { reason: data.reason })
      };

      const response = await axiosInstance.patch<ApiResponse<TransitData>>(
        "/api/delivery/transit/accept-or-reject",
        requestBody
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transit", variables.deliveryTransitId] });
      queryClient.invalidateQueries({ queryKey: ["transits"] });
    },
  });
};
