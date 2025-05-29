import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../rest_api/inventoryGET";

export const useGetProduct = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProduct,
    staleTime: 5000
  })
}