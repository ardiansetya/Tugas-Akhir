import { z } from "zod";

export const createTruckSchema = z.object({
  license_plate: z.string().min(1, "Plat nomor harus diisi"),
  model: z.string().min(1, "Model truk harus diisi"),
  cargo_type: z.string().min(1, "Tipe kargo harus diisi"),
  capacity_kg: z.number().min(1, "Kapasitas harus lebih dari 0"),
  is_available: z.boolean(),
});

export type CreateTruckFormValues = z.infer<typeof createTruckSchema>;
