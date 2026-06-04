import {z} from 'zod'

export const deleteDeliverySchema = z.object({
    id: z.string()
})

export type DeleteDeliverySchema = z.infer<typeof deleteDeliverySchema>