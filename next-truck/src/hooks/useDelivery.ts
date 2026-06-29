import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  CreateDeliveryRequest,
  DeliveryData,
  DeliveryDetailData,
  TakeoverDeliveryRequest,
  TakeoverLogData,
  DeliveryAlertData,
} from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeliveriesActive = () => {
  return useQuery({
    queryKey: ["deliveriesActive"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<DeliveryData[]>>(
        "/api/delivery/active"
      );
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
export const useHistoryDeliveries = () => {
  return useQuery({
    queryKey: ["deliveriesHistory"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<DeliveryData[]>>(
        "/api/delivery/history"
      );
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get delivery by ID (with full details including transits and alerts)
export const useDelivery = (deliveryId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["delivery", deliveryId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<DeliveryDetailData>>(
        `/api/delivery/detail/${deliveryId}`
      );
      return response.data.data;
    },
    enabled: !!deliveryId && enabled,
    staleTime: 1 * 60 * 1000,
  });
};

// Create delivery
export const useCreateDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDeliveryRequest) => {
      const response = await axiosInstance.post<ApiResponse<DeliveryData>>(
        "/api/delivery",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveriesActive"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "available"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "all"] });
      queryClient.invalidateQueries({ queryKey: ["trucksAvailable"] });
    },
  });
};

// Update delivery
export const useUpdateDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deliveryId,
      data,
    }: {
      deliveryId: string;
      data: Partial<CreateDeliveryRequest>;
    }) => {
      const response = await axiosInstance.put<ApiResponse<DeliveryData>>(
        `/api/delivery/${deliveryId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["delivery", variables.deliveryId],
      });
      queryClient.invalidateQueries({ queryKey: ["deliveriesActive"] });
    },
  });
};

export const finishDelivery = async (deliveryId: string) => {
  const response = await axiosInstance.patch<ApiResponse<DeliveryData>>(
    `/api/delivery/finish/${deliveryId}`, {}
  );

  return response.data.data;
};

// Update finish delivery
export const useFinishDelivery = (deliveryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => finishDelivery(deliveryId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deliveriesActive"],
      });
      queryClient.invalidateQueries({
        queryKey: ["deliveriesHistory"],
      });
      queryClient.invalidateQueries({
        queryKey: ["drivers", "available"],
      });
      queryClient.invalidateQueries({
        queryKey: ["drivers", "all"],
      });
      queryClient.invalidateQueries({
        queryKey: ["trucksAvailable"],
      });
      queryClient.invalidateQueries({
        queryKey: ["trucksAvailable"],
      });
      queryClient.invalidateQueries({
        queryKey: ["delivery", deliveryId],
      });

      toast.success("Pengiriman berhasil diselesaikan");
    },
    onError: (error) => {
      console.error("Error finishing delivery:", error);

      // Handle specific error codes
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };

      if (axiosError.response?.status === 403) {
        toast.error(
          "Anda tidak memiliki izin untuk menyelesaikan pengiriman ini"
        );
      } else if (axiosError.response?.status === 404) {
        toast.error("Pengiriman tidak ditemukan");
      } else {
        const errorMessage =
          axiosError.response?.data?.message ||
          "Gagal menyelesaikan pengiriman";
        toast.error(errorMessage);
      }
    },
  });
};

// Delete delivery
export const useDeleteDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deliveryId: string) => {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/delivery/${deliveryId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveriesActive"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "available"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "all"] });
      queryClient.invalidateQueries({ queryKey: ["trucksAvailable"] });
      toast.info("Pengiriman berhasil dihapus");
    },
    onError: (error) => {
      console.error("Error deleting delivery:", error);
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.message || "Gagal menghapus pengiriman";
      toast.error(errorMessage);
    },
  });
};

// Takeover delivery (change driver)
export const useTakeoverDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TakeoverDeliveryRequest) => {
      const response = await axiosInstance.post<ApiResponse<DeliveryData>>(
        "/api/delivery/takeover",
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["delivery", variables.delivery_id],
      });
      queryClient.invalidateQueries({ queryKey: ["deliveriesActive"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "available"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["takeoverLogs", variables.delivery_id],
      });

      toast.success("Driver berhasil diganti");
    },
    onError: (error) => {
      console.error("Error takeover delivery:", error);

      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };

      if (axiosError.response?.status === 403) {
        toast.error("Anda tidak memiliki izin untuk mengganti driver");
      } else if (axiosError.response?.status === 404) {
        toast.error("Pengiriman tidak ditemukan");
      } else {
        const errorMessage =
          axiosError.response?.data?.message || "Gagal mengganti driver";
        toast.error(errorMessage);
      }
    },
  });
};

// Get takeover logs for a delivery
export const useTakeoverLogs = (deliveryId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["takeoverLogs", deliveryId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<TakeoverLogData[]>>(
        `/api/delivery/takeover/${deliveryId}`
      );
      return response.data.data;
    },
    enabled: !!deliveryId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get all recent alerts
export const useRecentAlerts = () => {
  return useQuery({
    queryKey: ["recentAlerts"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<DeliveryAlertData[]>>(
        "/api/delivery/alert"
      );
      return response.data.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10000, // Poll every 10 seconds
  });
};

