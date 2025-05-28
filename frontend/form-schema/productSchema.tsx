import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string(),
  brand: z.string(),
  color: z.string(),
  price: z.string(),
  quantity: z.string()
})