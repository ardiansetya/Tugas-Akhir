import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { AutocompleteDTO, DirectionsResponse, MatchingResponse, WebResponse } from "@/types/api";

export const useGeoAutocomplete = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["geo", "autocomplete", query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<WebResponse<AutocompleteDTO[]>>(
        `/geo/autocomplete`,
        { params: { q: query } }
      );
      return data.data;
    },
    enabled: enabled && query.length > 2,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGeoDirections = (points: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["geo", "directions", points],
    queryFn: async () => {
      const { data } = await axiosInstance.get<WebResponse<DirectionsResponse>>(
        `/geo/directions`,
        { params: { points } }
      );
      return data.data;
    },
    enabled: enabled && !!points,
  });
};

export const useGeoMatching = (points: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["geo", "matching", points],
    queryFn: async () => {
      const { data } = await axiosInstance.get<WebResponse<MatchingResponse>>(
        `/geo/matching`,
        { params: { points } }
      );
      return data.data;
    },
    enabled: enabled && !!points,
  });
};
