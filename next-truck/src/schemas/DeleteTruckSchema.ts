import {z} from 'zod'

export const deleteTruckSchema = z.object({
    id: z.string()
})

export type DeleteTruckSchema = z.infer<typeof deleteTruckSchema>