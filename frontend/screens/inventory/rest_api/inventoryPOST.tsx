import { api } from "@/api/api";

export const addProduct = async (data: Record<string, any>) => {
  try {
    const res = await api.post('app/api/create/product/', data);
    return res.data;
  } catch (err) {
    throw err;
  }
}