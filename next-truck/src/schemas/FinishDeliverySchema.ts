import {z} from 'zod'

export const finishDeliverySchema = z.object({
    id: z.string()
})

export type FinishDeliverySchema = z.infer<typeof finishDeliverySchema>