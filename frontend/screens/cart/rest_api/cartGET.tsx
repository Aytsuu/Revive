import { api } from "@/api/api";

export const getCartList = async (userId: string) => {
  try {
    const res = await api.get(`app/api/cart/list/${userId}/`);
    return res.data;
  } catch (err) {
    throw err;
  }
}