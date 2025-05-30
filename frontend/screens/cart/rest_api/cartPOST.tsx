import { api } from "@/api/api";

export const addCart = async (data: Record<string, any>) => {
  try {
    console.log(data)
    const res = await api.post('app/api/create/cart/', data);
    return res.data;
  } catch (err) {
    throw err;
  }
}