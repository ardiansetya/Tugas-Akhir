import { z } from "zod";

export const updateTransitPointSchema = z.object({
  loading_city_id: z.number().min(1, "Kota loading harus dipilih"),
  unloading_city_id: z.number().min(1, "Kota unloading harus dipilih"),
  estimated_duration_minute: z.number().min(1, "Durasi estimasi harus lebih dari 0 menit"),
  cargo_type: z.string().min(1, "Tipe kargo harus diisi"),
  extra_cost: z.number().min(0, "Biaya tambahan tidak boleh negatif"),
  is_active: z.boolean(),
}).refine(
  (data) => data.loading_city_id !== data.unloading_city_id,
  {
    message: "Kota loading dan unloading tidak boleh sama",
    path: ["unloading_city_id"],
  }
);

export type UpdateTransitPointFormValues = z.infer<typeof updateTransitPointSchema>;
