import { api } from "@/api/api";

export const updateProduct = async (data: Record<string, any>) => {
  try {
    const res = await api.put('api/update/product/', data)
  } catch (err) {
    throw err
  }
}