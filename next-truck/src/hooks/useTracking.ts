import axiosInstance from "@/lib/axios";
import { ApiResponse, TrackingData } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

// Get tracking positions by delivery ID
export const useTrackingPositions = (
  deliveryId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["tracking", deliveryId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TrackingData>>(
        `/api/delivery/positions/${deliveryId}`
      );
      return response.data.data;
    },
    enabled: !!deliveryId && enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes - matches backend update frequency
    refetchInterval: 15 * 60 * 1000, // Auto refetch every 15 minutes (same as backend)
    refetchIntervalInBackground: true, // Continue refetching in background
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};
