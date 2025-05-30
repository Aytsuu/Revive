import { api } from "@/api/api";

export const updateProduct = async (data: Record<string, any>, prodId: string) => {
  try {
    const res = await api.put(`app/api/update/product/${prodId}/` , data)
    return res.data;
  } catch (err) {
    throw err
  }
}