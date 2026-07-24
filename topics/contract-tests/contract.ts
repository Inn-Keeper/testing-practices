import { z } from 'zod'

export const userResponseContract = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
})

export type UserResponse = z.infer<typeof userResponseContract>
