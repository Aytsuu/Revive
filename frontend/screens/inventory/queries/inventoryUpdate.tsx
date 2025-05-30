import { useMutation } from "@tanstack/react-query";
import { updateProduct } from "../rest_api/inventoryPUT";

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({data, prodId} : {
      data: Record<string, any>;
      prodId: string
    }) => updateProduct(data, prodId)
  })
}