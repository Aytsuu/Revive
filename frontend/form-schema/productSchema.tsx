import { z } from "zod";

export const productFormSchema = z.object({
  prod_name: z.string()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters"),
    
  prod_details: z.string()
    .min(1, "Product details are required")
    .max(500, "Product details must be less than 500 characters"),
    
  prod_brand: z.string()
    .min(1, "Brand name is required")
    .max(50, "Brand name must be less than 50 characters"),
    
  prod_price: z.string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number with up to 2 decimal places"),
    
  prod_stock: z.string()
    .min(1, "Stock quantity is required")
    .regex(/^\d+$/, "Stock must be a whole number")
});