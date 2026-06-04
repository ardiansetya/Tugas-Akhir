"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

interface TanstackProviderProps {
  children: React.ReactNode;
}

export default function TanstackProvider({ children }: TanstackProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Waktu data dianggap fresh (tidak perlu refetch)
            staleTime: 60 * 1000, // 1 menit
            // Waktu cache disimpan
            gcTime: 5 * 60 * 1000, // 5 menit (sebelumnya cacheTime)
            // Retry otomatis saat gagal
            retry: 1,
            // Refetch saat window focus
            refetchOnWindowFocus: false,
            // Refetch saat mount
            refetchOnMount: true,
            // Refetch saat reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry untuk mutations
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
