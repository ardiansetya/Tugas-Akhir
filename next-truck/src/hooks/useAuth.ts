import {  useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { tokenStorage } from "@/lib/axios";
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/api";
import { useRouter } from "next/navigation";

// Login
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Save tokens to localStorage
      tokenStorage.setTokens(data.data.access_token, data.data.refresh_token);

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Redirect to dashboard
      router.push("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Logout
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Optional: Call logout endpoint if exists
      // await axiosInstance.post("/auth/logout");
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear tokens
      tokenStorage.clearTokens();

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      router.push("/login");
    },
  });
};

// Refresh Token (usually handled automatically by axios interceptor)
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (request: RefreshTokenRequest) => {
      const response = await axiosInstance.post<
        ApiResponse<RefreshTokenResponse>
      >("/auth/refresh-token", request);
      return response.data;
    },
    onSuccess: (data) => {
      // Save new tokens
      tokenStorage.setTokens(data.data.access_token, data.data.refresh_token);
    },
  });
};

// Register (if exists)
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: {
      username: string;
      email: string;
      password: string;
      phone_number: string;
      age: number;
    }) => {
      const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
        "/auth/register",
        userData
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Save tokens
      tokenStorage.setTokens(data.data.access_token, data.data.refresh_token);

      // Redirect to dashboard
      router.push("/dashboard");
    },
  });
};

// Change Password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwords: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }) => {
      const response = await axiosInstance.post<ApiResponse<null>>(
        "/api/users/profile/password",
        passwords
      );
      return response.data;
    },
  });
};
