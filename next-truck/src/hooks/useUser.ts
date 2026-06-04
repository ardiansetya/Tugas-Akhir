import axiosInstance, { tokenStorage } from "@/lib/axios";
import {
  ApiResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserData,
  UserProfile,
  ChangePasswordRequest,
  CreateUserRequest,
} from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<UserProfile>>(
        "/api/users/profile"
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const getAllDrviersAvailable = async () => {
  const response = await axiosInstance.get<ApiResponse<UserData[]>>(
    "/api/users/drivers/available"
  );
  return response.data.data;
};
export const getAllDrviers = async () => {
  const response = await axiosInstance.get<ApiResponse<UserData[]>>(
    "/api/users/drivers"
  );
  return response.data.data;
};

// get all driver available
export const useDriverAvailable = () => {
  return useQuery({
    queryKey: ["drivers", "available"],
    queryFn: getAllDrviersAvailable,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// get all drivers (available and unavailable)
export const useDrivers = () => {
  return useQuery({
    queryKey: ["drivers", "all"],
    queryFn: getAllDrviers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID
export const useUser = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<UserData>>(
        `/api/users/${userId}`
      );
      return response.data.data;
    },
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<UserData[]>>(
        "/api/users"
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Create user (admin)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await axiosInstance.post<ApiResponse<UserData>>(
        "/auth/register",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "available"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "all"] });
      toast.success("Driver berhasil ditambahkan");
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.message || "Gagal menambahkan driver";
      toast.error(errorMessage);
    },
  });
};

// Delete user (admin)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/users/${userId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "available"] });
      queryClient.invalidateQueries({ queryKey: ["drivers", "all"] });
      toast.success("Driver berhasil dihapus");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
          config?: { url?: string };
        };
      };

      console.log("Error status:", axiosError.response?.status);
      console.log("Error data:", axiosError.response?.data);
      console.log("Request URL:", axiosError.response?.config?.url);

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Gagal menghapus driver";
      toast.error(errorMessage);
    },
  });
};

// Update current user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await axiosInstance.post<ApiResponse<UpdateProfileResponse>>(
        "/api/users/profile",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Save new refresh token if provided (some APIs rotate refresh tokens)
      if (data.data.refresh_token) {
        tokenStorage.setRefreshToken(data.data.refresh_token);
      }
      // Invalidate current user profile to refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await axiosInstance.patch<ApiResponse<null>>(
        "/api/users/profile/password",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password berhasil diubah");
    },
    onError: (error) => {
      console.error("Error changing password:", error);

      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };

      if (axiosError.response?.status === 400) {
        toast.error("Password saat ini tidak sesuai");
      } else if (axiosError.response?.status === 401) {
        toast.error("Sesi Anda telah berakhir, silakan login kembali");
      } else {
        const errorMessage =
          axiosError.response?.data?.message || "Gagal mengubah password";
        toast.error(errorMessage);
      }
    },
  });
};
