import { z } from 'zod';

export const SignupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  dateOfBirth: z.string().date(),
  phone: z.string(),
  password: z.string()
})