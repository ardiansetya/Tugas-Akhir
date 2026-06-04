import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

// City Type
export type CityData = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
};

// Get all cities
export const useCities = () => {
  return useQuery({
    queryKey: ["cities", "all"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<CityData[]>>(
        "/api/cities"
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (cities rarely change)
  });
};

// Get city by ID
export const useCity = (cityId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["cities", "detail", cityId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<CityData>>(
        `/api/cities/${cityId}`
      );
      return response.data.data;
    },
    enabled: !!cityId && enabled,
    staleTime: 10 * 60 * 1000,
  });
};

// Create city
export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      latitude: number;
      longitude: number;
      country: string;
    }) => {
      const response = await axiosInstance.post<ApiResponse<CityData>>(
        "/api/cities",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
};

// Update city
export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cityId,
      data,
    }: {
      cityId: number;
      data: Partial<{
        name: string;
        latitude: number;
        longitude: number;
        country: string;
      }>;
    }) => {
      const response = await axiosInstance.put<ApiResponse<CityData>>(
        `/api/cities/${cityId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cities", "detail", variables.cityId],
      });
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
};

// Delete city
export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cityId: number) => {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/cities/${cityId}`
      );
      return response.data;
    },
    onSuccess: (_, cityId) => {
      queryClient.removeQueries({
        queryKey: ["cities", "detail", cityId],
      });
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
};
