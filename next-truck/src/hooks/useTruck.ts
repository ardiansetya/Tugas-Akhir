import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  CreateTruckRequest,
  TruckData,
  UpdateTruckRequest,
} from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Get all trucks
export const useTrucks = () => {
  return useQuery({
    queryKey: ["trucks"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TruckData[]>>(
        "/api/trucks"
      );
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get truck by ID
export const useTruck = (truckId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["truck", truckId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TruckData>>(
        `/api/trucks/${truckId}`
      );
      return response.data.data;
    },
    enabled: !!truckId && enabled,
    staleTime: 2 * 60 * 1000,
  });
};

// Get available trucks
export const useAvailableTrucks = () => {
  return useQuery({
    queryKey: ["trucksAvailable"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TruckData[]>>(
        "/api/trucks/available"
      );
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000,
  });
};

// Create truck
export const useCreateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTruckRequest) => {
      const response = await axiosInstance.post<ApiResponse<TruckData>>(
        "/api/trucks",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucksAvailable"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

// Update truck
export const useUpdateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      truckId,
      data,
    }: {
      truckId: string;
      data: UpdateTruckRequest;
    }) => {
      const response = await axiosInstance.put<ApiResponse<TruckData>>(
        `/api/trucks/${truckId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["truck", variables.truckId] });
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
  });
};

// Delete truck
export const useDeleteTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (truckId: string) => {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/trucks/${truckId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucksAvailable"] });
    },
  });
};

const toggleTruckAvailability = async (truckId: string): Promise<TruckData> => {
  const response = await axiosInstance.get(
    `/api/trucks/toggle-availability/${truckId}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to toggle truck availability");
  }

  return response.data;
};

// Update truck availability
export const useUpdateTruckAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      truckId,
      isAvailable,
    }: {
      truckId: string;
      isAvailable: boolean;
    }) => {
      const response = await axiosInstance.put<ApiResponse<TruckData>>(
        `/api/trucks/maintenance/${truckId}`,
        { isAvailable }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["truck", variables.truckId] });
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucksAvailable"] });

      toast.info("Truck berhasil dinonaktifkan");
    },
  });
};
export const useToggleTruckAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTruckAvailability,
    onSuccess: (_, truckId) => {
      queryClient.invalidateQueries({ queryKey: ["truck", truckId] });
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucksAvailable"] });

      toast.success("Truck berhasil diaktifkan");
    },
  });
};
