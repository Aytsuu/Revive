import { api } from "@/api/api";

export const deleteProduct = async (prodId: string) => {
  try {
    const res = await api.delete(`app/api/delete/product/${prodId}/`);
    return res;
  } catch (err) { 
    throw err;
  }
}