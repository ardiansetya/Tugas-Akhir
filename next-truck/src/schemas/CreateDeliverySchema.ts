import { z } from "zod";

export const createDeliverySchema = z.object({
    truck_id: z.string(),
    route_id: z.string(),
    worker_id: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
});

export type CreateDeliveryFormValues = z.infer<typeof createDeliverySchema>;
