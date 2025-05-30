import { useQuery } from "@tanstack/react-query";
import { getCartList } from "../rest_api/cartGET";

export const useGetCarList = (userId: string) => {
  return useQuery({
    queryKey: ['cartList', userId],
    queryFn: () => getCartList(userId),
    staleTime: 5000
  })
}