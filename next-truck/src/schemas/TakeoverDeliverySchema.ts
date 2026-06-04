import { z } from "zod";

export const takeoverDeliverySchema = z.object({
  delivery_id: z.string().min(1, "Delivery ID harus diisi"),
  from_worker_id: z.string().min(1, "Driver asal harus dipilih"),
  to_worker_id: z.string().min(1, "Driver tujuan harus dipilih"),
  handover_at: z.number().min(0, "Waktu handover harus valid"),
  reason: z.string().min(1, "Alasan harus diisi"),
});

export type TakeoverDeliveryFormValues = z.infer<typeof takeoverDeliverySchema>;
