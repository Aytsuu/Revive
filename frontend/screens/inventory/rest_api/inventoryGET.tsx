import { api } from "@/api/api";

export const getProduct = async () => {
  try {
    const res = await api.get('app/api/product/list/')
    return res.data
  } catch(err) {
    throw err;
  }
}