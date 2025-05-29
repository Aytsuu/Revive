import { useMutation } from "@tanstack/react-query";
import { updateProduct } from "../rest_api/inventoryPUT";

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: (data: Record<string, any>) => updateProduct(data)
  })
}