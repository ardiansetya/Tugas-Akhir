import { z } from "zod";

export const updateRouteSchema = z.object({
  start_city_id: z.string().min(1, "Kota asal harus diisi"),
  end_city_id: z.string().min(1, "Kota tujuan harus diisi"),
  details: z.string(),
  cargo_type: z.string().min(1, "Tipe kargo harus diisi"),
  base_price: z.number().min(1, "Harga dasar harus lebih dari 0"),
  distance_km: z.number().min(1, "Jarak harus lebih dari 0"),
  estimated_duration_hours: z.number().min(0.1, "Durasi estimasi harus lebih dari 0"),
  is_active: z.boolean(),
});

export type UpdateRouteFormValues = z.infer<typeof updateRouteSchema>;
