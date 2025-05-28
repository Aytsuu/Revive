import { z } from 'zod';

export const passwordFormat = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })

export const signupSchema = z.object({
  phone: z.string(),
  dateOfBirth: z.string(),
  username: z.string()
    .min(1, "Username is required")
    .min(6, "Username must be atleast 6 letters"),
  email: z.string()
    .email({ message: "Invalid email address" }),
  password: passwordFormat,
  confirmPassword: z.string()
    .min(1, "Confirm Password is required")
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Password does not match",
  path: ["confirmPassowrd"]
})

export const loginSchema = z.object({
  email_or_username: z.string()
    .min(1, 'Enter your email or username'),
  password: z.string()
    .min(1, 'Enter your password')
})