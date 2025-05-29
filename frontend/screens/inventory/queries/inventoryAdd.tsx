import { useMutation } from "@tanstack/react-query";
import { addProduct } from "../rest_api/inventoryPOST";

export const useAddProduct = () => {
  return useMutation({
    mutationFn: (data: Record<string, any>) => addProduct(data)
  }) 
}